class Transaction {
    /**
     * @constructor
     * 
     * @param {String} sender       Адрес отправителя
     * @param {String} recipient    Адрес получателя
     * @param {Number} amount       Кол-во переводимых монет
     * @param {Number} timestamp    Метка создании транзакции
     */
    constructor (sender, recipient, amount, timestamp, hash) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.timestamp = timestamp;
        this.hash = hash;
    }
}

module.exports = Transaction;