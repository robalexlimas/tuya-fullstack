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
    DECLARE v_NewAvailable DECIMAL(18,2);
    DECLARE v_TxnId CHAR(36) DEFAULT (UUID());

    START TRANSACTION;

    SELECT CreditLimit, AvailableCredit
      INTO v_CreditLimit, v_Available
      FROM cards
      WHERE CardId = p_CardId AND UserId = p_UserId
      FOR UPDATE;

    IF v_CreditLimit IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Card not found for user.';
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

DROP PROCEDURE IF EXISTS sp_get_transactions;//
CREATE PROCEDURE sp_get_transactions(
    IN p_UserId CHAR(36),
    IN p_CardId CHAR(36)
)
BEGIN
    SELECT *
    FROM card_transactions
    WHERE UserId = p_UserId
      AND (p_CardId IS NULL OR CardId = p_CardId)
    ORDER BY CreatedAtUtc DESC;
END;//

DELIMITER ;
