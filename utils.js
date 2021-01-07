//

const chunkify = (text) => {
    if (text.length <= 280) {
        return [text, ''];
    }
    const first = text.slice(0, 280);
    const last = first.match(/\w*$/);
    const len = first.length - last[0].length;
    console.log(last);
    return [text.slice(0, len), text.slice(len)];
};

const allChunks = (text) => {
    const chunks = [];
    while (text.length) {
        const [a, b] = chunkify(text);
        chunks.push(a);
        text = b;
    }
    return chunks;
};

module.exports = { allChunks, chunkify };
