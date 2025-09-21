// api/index.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Vercelにデプロイする際は、環境変数を使用します。
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'プロンプトがありません' });
    }

    const decodedPrompt = decodeURIComponent(prompt);

    // モデルを 'gemini-1.5-flash' に設定
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // プロンプトに応答文字数制限を追加
    const fullPrompt = `${decodedPrompt} (200文字以内で答えてください)`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error('コンテンツの生成中にエラーが発生しました:', error);
    res.status(500).json({ error: 'コンテンツの生成に失敗しました' });
  }
};
