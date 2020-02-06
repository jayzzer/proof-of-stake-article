let _blockchain = [];
let isForging = false;

class Blockchain {
    /**
     * Возвращает массив цепочки блоков
     * @returns {Array}
     */
    static getBlockchain() {
        return _blockchain;
    }
    
    /**
     * Возвращает последний блок блокчейна
     * @returns {Block}
     */
    static get latestBlock() {
        return _blockchain[_blockchain.length - 1];
    }
    
    /**
     * Добавляет новый блок в цепочку
     */
    static addBlock(newBlock) {
        _blockchain.push(newBlock);
    }

    /**
     * Вычисление 'generation signature'
     * 
     * @param {Block} latestBlock - последний блок
     * @param {String} pubKey - публичный ключ 
     * 
     * @returns {String}
     */
    static computeGenerationSignature(latestBlock, pubKey) {
        const prevGenerationSignature = latestBlock.generationSignature; //(1)
        const genSigPlusPubKey = prevGenerationSignature + pubKey; //(2)
        
        return crypto.createHash('sha256')
                    .update(genSigPlusPubKey) //(3)
                    .digest('hex');
    }

    /**
     * Вычисление значения 'hit'
     * 
     * @param {String} generationSignature
     *
     * @returns {Number}
     */
    static computeHit(generationSignature) {
        return parseInt( generationSignature.substr(0, 8), 16 );
    }

    /**
     * Генерация 'target'
     *
     * @param {Block} latestBlock - последний блок
     * @param {Number} timestamp
     * @param {String} pubKey - публичный ключ forger'а
     *
     * @return {Number}
     */
    static computeTarget(latestBlock, timestamp, pubKey) {
        const previousBaseTarget = latestBlock.baseTarget;

        const forgerBalance = Account.getBalance(pubKey);
        const elapsedTime = timestamp - latestBlock.timestamp;
        
        return +previousBaseTarget * forgerBalance * elapsedTime;
    }

    /**
     * Проверка выполнения условия hit < target
     *
     * @param {Block} latestBlock
     * @param {Number} timestamp
     * @param {String} pubKey
     
    * @returns {Boolean}
    */
    static verifyHit(latestBlock, timestamp, pubKey) {
        const newGenerationSignature = Blockhain.computeGenerationSignature(latestBlock, pubKey);
        const hit = Blockchain.computeHit(newGenerationSignature);
        
        const target = Blockchain.computeTarget(latestBlock, timestamp, pubKey);
        
        return hit < target;
    }

    /**
     * Запуск forging'а
     */
    static startForging(pubKey) {
        isForging = true;
        
        Blockchain.forge(pubKey);
    }

    /**
     * Остановка forging'а
     */
    static stopForging() {
        isForging = false;
    }

    /**
     * Процесс forging'а
     */
    static forge(pubKey) {
        if (!isForging) return;
        
        const latestBlock = Blockchain.latestBlock;
        const timestamp = Date.now() / 1000; //в секундах
        if (verifyHit(latestBlock, timestamp, pubKey)) {
            const transactions = Mempool.getTransactionsForBlock();
            const newBlock = generateBlock(latestBlock, transactions, pubKey, timestamp);
            
            Blockchain.addBlock(newBlock);
        }
        
        setTimeout(Blockchain.forge(pubKey), 1000);
    }
}

module.exports = Blockchain;