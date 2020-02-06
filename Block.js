class Block {
    /**
     * @constructor
     * 
     * @param {Number} index номер блока
     * @param {String} generator публичный ключ создателя блока 
     * @param {Array<Transaction>} transactions транзакции для блока
     * @param {Number} timestamp метка времени генерации блока
     * @param {Number} baseTarget  
     * @param {String} generationSignature 
     * @param {String} hash хэш блока
     */
    constructor (index, generator, transactions, timestamp, baseTarget, generationSignature, hash) {
        this.index = index;
        this.generator = generator;
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.baseTarget = baseTarget;
        this.generationSignature = generationSignature;
        this.hash = hash;
    }

    /**
     * Создание нового блока
     *
     * @param {Block} latestBlock
     * @param {Array<Transaction>} transactions
     * @param {String} pubKey
     * @param {Number} timestamp
     *
     * @returns {Block}
     */
    static generateBlock(latestBlock, transactions, pubKey, timestamp) {
        const index = latestBlock.index + 1;
        
        //Вычисляем baseTarget
        const maxTarget = Math.min(2*latestBlock.baseTarget, Block.maxBaseTarget);//(1)
        const minTarget = Math.max(Math.floor(latestBlock.baseTarget / 2), 1);//(2)
        const elapsedTime = timestamp - latestBlock.timestamp;
        const candidate = Math.floor((latestBlock.baseTarget * elapsedTime) / 60);//(3)
        const baseTarget = Math.min( Math.max(minTarget, candidate), maxTarget );
        
        const generationSignature = Blockchain.computeGenerationSignature(latestBlock, pubKey);
        
        const hash = Block.calcHash(index, pubKey, timestamp, baseTarget, generationSignature);
        
        return new Block(index, pubKey, transactions, timestamp, baseTarget, generationSignature, hash);
    }
    
    /**
     * Вычисление хэша блока
     *
     * @param {Number} index
     * @param {String} pubKey
     * @param {Number} timestamp
     * @param {Number} baseTarget
     * @param {String} generationSignature
     */
    static calcHash(index, pubKey, timestamp, baseTarget, generationSignature) {
        return crypto
            .createHash('sha256')
            .update(index + pubKey + timestamp + baseTarget + generationSignature)
            .digest('hex');
    }

    /**
     * Начальное кол-во монет в сети
     * @returns {Number}
     */
    static get initialCoinAmount() {
        return 1000000000;
    }

    /**
     * Начальное значение baseTarget
     * @returns {Number}
     */
    static get initialBaseTarget() {
        return 153722867;
    }

    /**
     * Максимально возможное значение baseTarget
     * @returns {Number}
     */
    static get maxBaseTarget() {
        return Block.initialCountAmount * Block.initialBaseTaret;
    }
}

module.exports = Block;