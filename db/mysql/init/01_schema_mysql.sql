USE credit_card_app;

-- Users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    UserId           CHAR(36) NOT NULL DEFAULT (UUID()),
    Username         VARCHAR(100) NOT NULL,
    Email            VARCHAR(256) NOT NULL,
    PasswordHash     VARCHAR(512) NOT NULL,
    PasswordSalt     VARCHAR(256) NOT NULL,
    IsActive         TINYINT(1) NOT NULL DEFAULT 1,
    CreatedAtUtc     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UpdatedAtUtc     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT PK_Users PRIMARY KEY (UserId),
    CONSTRAINT UQ_Users_Username UNIQUE (Username),
    CONSTRAINT UQ_Users_Email UNIQUE (Email)
) ENGINE=InnoDB;

-- Cards table
DROP TABLE IF EXISTS cards;
CREATE TABLE cards (
    CardId           CHAR(36) NOT NULL DEFAULT (UUID()),
    UserId           CHAR(36) NOT NULL,
    Brand            VARCHAR(50) NOT NULL,
    Last4            CHAR(4) NOT NULL,
    ExpMonth         TINYINT NOT NULL,
    ExpYear          SMALLINT NOT NULL,
    CreditLimit      DECIMAL(18,2) NOT NULL,
    AvailableCredit  DECIMAL(18,2) NOT NULL,
    Status           VARCHAR(20) NOT NULL,
    Nickname         VARCHAR(100) NULL,
    CreatedAtUtc     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UpdatedAtUtc     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT PK_Cards PRIMARY KEY (CardId),
    CONSTRAINT FK_Cards_Users FOREIGN KEY (UserId) REFERENCES users(UserId),
    CONSTRAINT CK_Cards_ExpMonth CHECK (ExpMonth BETWEEN 1 AND 12),
    CONSTRAINT CK_Cards_Limit CHECK (CreditLimit >= 0),
    CONSTRAINT CK_Cards_Available CHECK (AvailableCredit >= 0 AND AvailableCredit <= CreditLimit),
    CONSTRAINT CK_Cards_Status CHECK (Status IN ('ACTIVE','BLOCKED','CLOSED'))
) ENGINE=InnoDB;
CREATE INDEX IX_Cards_UserId ON cards(UserId);

-- Transactions table
DROP TABLE IF EXISTS card_transactions;
CREATE TABLE card_transactions (
    TransactionId    CHAR(36) NOT NULL DEFAULT (UUID()),
    CardId           CHAR(36) NOT NULL,
    UserId           CHAR(36) NOT NULL,
    Type             VARCHAR(20) NOT NULL,
    Amount           DECIMAL(18,2) NOT NULL,
    Currency         CHAR(3) NOT NULL DEFAULT 'USD',
    Merchant         VARCHAR(200) NULL,
    Description      VARCHAR(400) NULL,
    Status           VARCHAR(20) NOT NULL,
    CreatedAtUtc     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT PK_CardTransactions PRIMARY KEY (TransactionId),
    CONSTRAINT FK_Tx_Card FOREIGN KEY (CardId) REFERENCES cards(CardId),
    CONSTRAINT FK_Tx_User FOREIGN KEY (UserId) REFERENCES users(UserId),
    CONSTRAINT CK_Tx_Type CHECK (Type IN ('PAYMENT','PURCHASE','REFUND')),
    CONSTRAINT CK_Tx_Status CHECK (Status IN ('PENDING','COMPLETED','FAILED')),
    CONSTRAINT CK_Tx_Amount CHECK (Amount > 0)
) ENGINE=InnoDB;
CREATE INDEX IX_Tx_CardId ON card_transactions(CardId, CreatedAtUtc DESC);
CREATE INDEX IX_Tx_UserId ON card_transactions(UserId, CreatedAtUtc DESC);

-- History of transaction status/amount changes
DROP TABLE IF EXISTS card_transaction_history;
CREATE TABLE card_transaction_history (
    HistoryId       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    TransactionId   CHAR(36) NOT NULL,
    OldStatus       VARCHAR(20) NULL,
    NewStatus       VARCHAR(20) NOT NULL,
    OldAmount       DECIMAL(18,2) NULL,
    NewAmount       DECIMAL(18,2) NOT NULL,
    ChangedAtUtc    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT PK_TxHistory PRIMARY KEY (HistoryId),
    CONSTRAINT FK_TxHistory_Tx FOREIGN KEY (TransactionId) REFERENCES card_transactions(TransactionId)
) ENGINE=InnoDB;
CREATE INDEX IX_TxHistory_Tx ON card_transaction_history(TransactionId, ChangedAtUtc DESC);

-- Triggers to enforce expiry and credit invariants (CHECK with non-deterministic functions is disallowed)
DELIMITER //
DROP TRIGGER IF EXISTS trg_cards_bi_validate;//
CREATE TRIGGER trg_cards_bi_validate
BEFORE INSERT ON cards
FOR EACH ROW
BEGIN
    IF NEW.ExpMonth < 1 OR NEW.ExpMonth > 12 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ExpMonth must be between 1 and 12';
    END IF;

    IF NEW.ExpYear < YEAR(UTC_TIMESTAMP()) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ExpYear must be current year or later';
    END IF;

    IF NEW.AvailableCredit < 0 OR NEW.AvailableCredit > NEW.CreditLimit THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'AvailableCredit must be between 0 and CreditLimit';
    END IF;
END;//

DROP TRIGGER IF EXISTS trg_cards_bu_validate;//
CREATE TRIGGER trg_cards_bu_validate
BEFORE UPDATE ON cards
FOR EACH ROW
BEGIN
    IF NEW.ExpMonth < 1 OR NEW.ExpMonth > 12 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ExpMonth must be between 1 and 12';
    END IF;

    IF NEW.ExpYear < YEAR(UTC_TIMESTAMP()) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ExpYear must be current year or later';
    END IF;

    IF NEW.AvailableCredit < 0 OR NEW.AvailableCredit > NEW.CreditLimit THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'AvailableCredit must be between 0 and CreditLimit';
    END IF;
END;//
DELIMITER ;

-- Triggers to audit transaction changes
DELIMITER //
DROP TRIGGER IF EXISTS trg_tx_ai_history;//
CREATE TRIGGER trg_tx_ai_history
AFTER INSERT ON card_transactions
FOR EACH ROW
BEGIN
    INSERT INTO card_transaction_history (TransactionId, OldStatus, NewStatus, OldAmount, NewAmount)
    VALUES (NEW.TransactionId, NULL, NEW.Status, NULL, NEW.Amount);
END;//

DROP TRIGGER IF EXISTS trg_tx_au_history;//
CREATE TRIGGER trg_tx_au_history
AFTER UPDATE ON card_transactions
FOR EACH ROW
BEGIN
    IF OLD.Status <> NEW.Status OR OLD.Amount <> NEW.Amount THEN
        INSERT INTO card_transaction_history (TransactionId, OldStatus, NewStatus, OldAmount, NewAmount)
        VALUES (NEW.TransactionId, OLD.Status, NEW.Status, OLD.Amount, NEW.Amount);
    END IF;
END;//
DELIMITER ;
