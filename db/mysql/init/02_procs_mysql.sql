USE credit_card_app;
DELIMITER //

DROP PROCEDURE IF EXISTS sp_create_user;//
CREATE PROCEDURE sp_create_user(
    IN p_Username VARCHAR(100),
    IN p_Email VARCHAR(256),
    IN p_PasswordHash VARCHAR(512),
    IN p_PasswordSalt VARCHAR(256)
)
BEGIN
    INSERT INTO users (Username, Email, PasswordHash, PasswordSalt)
    VALUES (p_Username, p_Email, p_PasswordHash, p_PasswordSalt);

    SELECT UserId, Username, Email, CreatedAtUtc
    FROM users
    WHERE Username = p_Username;
END;//

DROP PROCEDURE IF EXISTS sp_authenticate_user;//
CREATE PROCEDURE sp_authenticate_user(
    IN p_Username VARCHAR(100),
    IN p_PasswordHash VARCHAR(512)
)
BEGIN
    SELECT UserId, Username, Email, PasswordHash, PasswordSalt, IsActive
    FROM users
    WHERE Username = p_Username AND IsActive = 1
    LIMIT 1;
END;//

DROP PROCEDURE IF EXISTS sp_add_card;//
CREATE PROCEDURE sp_add_card(
    IN p_UserId CHAR(36),
    IN p_Brand VARCHAR(50),
    IN p_Last4 CHAR(4),
    IN p_ExpMonth TINYINT,
    IN p_ExpYear SMALLINT,
    IN p_CreditLimit DECIMAL(18,2),
    IN p_Nickname VARCHAR(100)
)
BEGIN
    DECLARE v_CardId CHAR(36) DEFAULT (UUID());

    INSERT INTO cards (CardId, UserId, Brand, Last4, ExpMonth, ExpYear, CreditLimit, AvailableCredit, Status, Nickname)
    VALUES (v_CardId, p_UserId, p_Brand, p_Last4, p_ExpMonth, p_ExpYear, p_CreditLimit, p_CreditLimit, 'ACTIVE', p_Nickname);

    SELECT * FROM cards WHERE CardId = v_CardId;
END;//

DROP PROCEDURE IF EXISTS sp_update_card;//
CREATE PROCEDURE sp_update_card(
    IN p_CardId CHAR(36),
    IN p_Brand VARCHAR(50),
    IN p_ExpMonth TINYINT,
    IN p_ExpYear SMALLINT,
    IN p_Nickname VARCHAR(100),
    IN p_Status VARCHAR(20)
)
BEGIN
    UPDATE cards
    SET Brand = p_Brand,
        ExpMonth = p_ExpMonth,
        ExpYear = p_ExpYear,
        Nickname = p_Nickname,
        Status = p_Status
    WHERE CardId = p_CardId;

    SELECT * FROM cards WHERE CardId = p_CardId;
END;//

DROP PROCEDURE IF EXISTS sp_close_card;//
CREATE PROCEDURE sp_close_card(
    IN p_CardId CHAR(36)
)
BEGIN
    UPDATE cards
    SET Status = 'CLOSED'
    WHERE CardId = p_CardId;

    SELECT * FROM cards WHERE CardId = p_CardId;
END;//

DROP PROCEDURE IF EXISTS sp_get_cards_by_user;//
CREATE PROCEDURE sp_get_cards_by_user(
    IN p_UserId CHAR(36)
)
BEGIN
    SELECT *
    FROM cards
    WHERE UserId = p_UserId
    ORDER BY CreatedAtUtc DESC;
END;//

DROP PROCEDURE IF EXISTS sp_record_payment;//
CREATE PROCEDURE sp_record_payment(
    IN p_CardId CHAR(36),
    IN p_UserId CHAR(36),
    IN p_Amount DECIMAL(18,2),
    IN p_Currency CHAR(3),
    IN p_Description VARCHAR(400)
)
BEGIN
    DECLARE v_CreditLimit DECIMAL(18,2);
    DECLARE v_Available DECIMAL(18,2);
    DECLARE v_Status VARCHAR(20);
    DECLARE v_NewAvailable DECIMAL(18,2);
    DECLARE v_TxnId CHAR(36) DEFAULT (UUID());

    IF p_Amount IS NULL OR p_Amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Amount must be greater than zero.';
    END IF;

    START TRANSACTION;

    SELECT CreditLimit, AvailableCredit, Status
      INTO v_CreditLimit, v_Available, v_Status
      FROM cards
      WHERE CardId = p_CardId AND UserId = p_UserId
      FOR UPDATE;

    IF v_CreditLimit IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Card not found for user.';
    END IF;

    IF v_Status <> 'ACTIVE' THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Card is not active.';
    END IF;

    SET v_NewAvailable = LEAST(v_CreditLimit, v_Available + p_Amount);

    UPDATE cards
       SET AvailableCredit = v_NewAvailable
     WHERE CardId = p_CardId;

    INSERT INTO card_transactions (TransactionId, CardId, UserId, Type, Amount, Currency, Merchant, Description, Status)
    VALUES (v_TxnId, p_CardId, p_UserId, 'PAYMENT', p_Amount, COALESCE(p_Currency, 'USD'), NULL, p_Description, 'COMPLETED');

    COMMIT;

    SELECT * FROM card_transactions WHERE TransactionId = v_TxnId;
END;//

DROP PROCEDURE IF EXISTS sp_record_purchase;//
CREATE PROCEDURE sp_record_purchase(
    IN p_CardId CHAR(36),
    IN p_UserId CHAR(36),
    IN p_Amount DECIMAL(18,2),
    IN p_Currency CHAR(3),
    IN p_Merchant VARCHAR(200),
    IN p_Description VARCHAR(400),
    IN p_Status VARCHAR(20)
)
BEGIN
    DECLARE v_CreditLimit DECIMAL(18,2);
    DECLARE v_Available DECIMAL(18,2);
    DECLARE v_CardStatus VARCHAR(20);
    DECLARE v_NewAvailable DECIMAL(18,2);
    DECLARE v_TxnId CHAR(36) DEFAULT (UUID());
    DECLARE v_Status VARCHAR(20);

    SET v_Status = COALESCE(p_Status, 'PENDING');

    IF p_Amount IS NULL OR p_Amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Amount must be greater than zero.';
    END IF;

    IF v_Status NOT IN ('PENDING', 'COMPLETED') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Status must be PENDING or COMPLETED for purchases.';
    END IF;

    START TRANSACTION;

    SELECT CreditLimit, AvailableCredit, Status
      INTO v_CreditLimit, v_Available, v_CardStatus
      FROM cards
      WHERE CardId = p_CardId AND UserId = p_UserId
      FOR UPDATE;

    IF v_CreditLimit IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Card not found for user.';
    END IF;

    IF v_CardStatus <> 'ACTIVE' THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Card is not active.';
    END IF;

    IF v_Available < p_Amount THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient available credit.';
    END IF;

    SET v_NewAvailable = v_Available - p_Amount;

    UPDATE cards
       SET AvailableCredit = v_NewAvailable
     WHERE CardId = p_CardId;

    INSERT INTO card_transactions (TransactionId, CardId, UserId, Type, Amount, Currency, Merchant, Description, Status)
    VALUES (v_TxnId, p_CardId, p_UserId, 'PURCHASE', p_Amount, COALESCE(p_Currency, 'USD'), p_Merchant, p_Description, v_Status);

    COMMIT;

    SELECT * FROM card_transactions WHERE TransactionId = v_TxnId;
END;//

DROP PROCEDURE IF EXISTS sp_finalize_transaction;//
CREATE PROCEDURE sp_finalize_transaction(
    IN p_TransactionId CHAR(36),
    IN p_NewStatus VARCHAR(20)
)
BEGIN
    DECLARE v_Type VARCHAR(20);
    DECLARE v_Status VARCHAR(20);
    DECLARE v_Amount DECIMAL(18,2);
    DECLARE v_CardId CHAR(36);
    DECLARE v_UserId CHAR(36);
    DECLARE v_Available DECIMAL(18,2);
    DECLARE v_CreditLimit DECIMAL(18,2);

    IF p_NewStatus NOT IN ('PENDING','COMPLETED','FAILED') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid status transition.';
    END IF;

    START TRANSACTION;

    SELECT Type, Status, Amount, CardId, UserId
      INTO v_Type, v_Status, v_Amount, v_CardId, v_UserId
      FROM card_transactions
      WHERE TransactionId = p_TransactionId
      FOR UPDATE;

    IF v_Type IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction not found.';
    END IF;

    IF v_Status <> p_NewStatus THEN
        -- For purchases: if moving from PENDING to FAILED, release hold back to available credit
        IF v_Type = 'PURCHASE' AND v_Status = 'PENDING' AND p_NewStatus = 'FAILED' THEN
            SELECT AvailableCredit, CreditLimit INTO v_Available, v_CreditLimit
              FROM cards
             WHERE CardId = v_CardId AND UserId = v_UserId;

            UPDATE cards
               SET AvailableCredit = LEAST(v_CreditLimit, v_Available + v_Amount)
             WHERE CardId = v_CardId;
        END IF;

        UPDATE card_transactions
           SET Status = p_NewStatus
         WHERE TransactionId = p_TransactionId;
    END IF;

    COMMIT;

    SELECT * FROM card_transactions WHERE TransactionId = p_TransactionId;
END;//

DROP PROCEDURE IF EXISTS sp_record_refund;//
CREATE PROCEDURE sp_record_refund(
    IN p_CardId CHAR(36),
    IN p_UserId CHAR(36),
    IN p_Amount DECIMAL(18,2),
    IN p_Currency CHAR(3),
    IN p_Merchant VARCHAR(200),
    IN p_Description VARCHAR(400)
)
BEGIN
    DECLARE v_CreditLimit DECIMAL(18,2);
    DECLARE v_Available DECIMAL(18,2);
    DECLARE v_CardStatus VARCHAR(20);
    DECLARE v_NewAvailable DECIMAL(18,2);
    DECLARE v_TxnId CHAR(36) DEFAULT (UUID());

    IF p_Amount IS NULL OR p_Amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Amount must be greater than zero.';
    END IF;

    START TRANSACTION;

    SELECT CreditLimit, AvailableCredit, Status
      INTO v_CreditLimit, v_Available, v_CardStatus
      FROM cards
      WHERE CardId = p_CardId AND UserId = p_UserId
      FOR UPDATE;

    IF v_CreditLimit IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Card not found for user.';
    END IF;

    IF v_CardStatus <> 'ACTIVE' THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Card is not active.';
    END IF;

    SET v_NewAvailable = LEAST(v_CreditLimit, v_Available + p_Amount);

    UPDATE cards
       SET AvailableCredit = v_NewAvailable
     WHERE CardId = p_CardId;

    INSERT INTO card_transactions (TransactionId, CardId, UserId, Type, Amount, Currency, Merchant, Description, Status)
    VALUES (v_TxnId, p_CardId, p_UserId, 'REFUND', p_Amount, COALESCE(p_Currency, 'USD'), p_Merchant, p_Description, 'COMPLETED');

    COMMIT;

    SELECT * FROM card_transactions WHERE TransactionId = v_TxnId;
END;//

DROP PROCEDURE IF EXISTS sp_get_transactions;//
CREATE PROCEDURE sp_get_transactions(
    IN p_UserId CHAR(36),
    IN p_CardId CHAR(36),
    IN p_Status VARCHAR(20)
)
BEGIN
    SELECT *
    FROM card_transactions
    WHERE UserId = p_UserId
      AND (p_CardId IS NULL OR CardId = p_CardId)
      AND (p_Status IS NULL OR Status = p_Status)
    ORDER BY CreatedAtUtc DESC;
END;//

DROP PROCEDURE IF EXISTS sp_get_payments_by_user;//
CREATE PROCEDURE sp_get_payments_by_user(
    IN p_UserId CHAR(36),
    IN p_CardId CHAR(36)
)
BEGIN
    SELECT *
    FROM card_transactions
    WHERE UserId = p_UserId
      AND Type = 'PAYMENT'
      AND (p_CardId IS NULL OR CardId = p_CardId)
    ORDER BY CreatedAtUtc DESC;
END;//

DROP PROCEDURE IF EXISTS sp_get_purchases_by_user;//
CREATE PROCEDURE sp_get_purchases_by_user(
    IN p_UserId CHAR(36),
    IN p_CardId CHAR(36)
)
BEGIN
    SELECT *
    FROM card_transactions
    WHERE UserId = p_UserId
      AND Type = 'PURCHASE'
      AND (p_CardId IS NULL OR CardId = p_CardId)
    ORDER BY CreatedAtUtc DESC;
END;//

DROP PROCEDURE IF EXISTS sp_get_transaction_history;//
CREATE PROCEDURE sp_get_transaction_history(
    IN p_TransactionId CHAR(36)
)
BEGIN
    SELECT *
    FROM card_transaction_history
    WHERE TransactionId = p_TransactionId
    ORDER BY ChangedAtUtc ASC;
END;//

DROP PROCEDURE IF EXISTS sp_get_user_summary;//
CREATE PROCEDURE sp_get_user_summary(
    IN p_UserId CHAR(36)
)
BEGIN
    SELECT 
        COUNT(DISTINCT CASE WHEN Type = 'PAYMENT' THEN TransactionId END) AS TotalPayments,
        COUNT(DISTINCT CASE WHEN Type = 'PURCHASE' THEN TransactionId END) AS TotalPurchases,
        COUNT(DISTINCT CASE WHEN Type = 'REFUND' THEN TransactionId END) AS TotalRefunds,
        SUM(CASE WHEN Type = 'PAYMENT' THEN Amount ELSE 0 END) AS TotalPaymentsAmount,
        SUM(CASE WHEN Type = 'PURCHASE' THEN Amount ELSE 0 END) AS TotalPurchasesAmount,
        SUM(CASE WHEN Type = 'REFUND' THEN Amount ELSE 0 END) AS TotalRefundsAmount
    FROM card_transactions
    WHERE UserId = p_UserId;
END;//

DELIMITER ;
