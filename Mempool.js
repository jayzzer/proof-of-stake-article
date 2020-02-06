const BLOCKSIZE = 3;
let transactions = [];

class Mempool {
    /**
     * Добавление транзакции
     * 
     * @param transaction 
     */
    static addTransaction(transaction) {  
        transactions.push(transaction);
    }

    /**
     * Возврат неподтвержденных транзакций
     * 
     * @returns {Array<Transaction>}
     */
    static getMempool() {
        return transactions;
    }

    /**
     * Сбор транзакций для нового блока
     * 
     * @returns {Array<Transaction>}
     */
    static getTransactionsForBlock() {
        const transactionsForBlock = transactions.splice(0, BLOCKSIZE);

        return transactionsForBlock;
    }
}

module.exports = Mempool;