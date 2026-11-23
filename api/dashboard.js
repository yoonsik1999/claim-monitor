// api/dashboard.js
export default async function handler(req, res) {
  const GAS_URL = process.env.GAS_URL;

  if (!GAS_URL) {
    return res.status(500).json({ status: 'error', message: 'GAS_URL 환경변수가 설정되지 않았습니다.' });
  }

  try {
    // 1. 대시보드 데이터 조회 (GET)
    if (req.method === 'GET') {
      const targetUrl = GAS_URL.includes('?') ? `${GAS_URL}&api=dashboard` : `${GAS_URL}?api=dashboard`;
      const response = await fetch(targetUrl, { redirect: 'follow' });
      const data = await response.json();
      return res.status(200).json(data);
    }

    // 2. 기준 일수/건수 설정 저장 (POST)
    if (req.method === 'POST') {
      const { days, threshold } = req.body;
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        body: JSON.stringify({
          action: 'saveSettings',
          days: Number(days) || 2,
          threshold: Number(threshold) || 3
        })
      });
      const result = await response.json();
      return res.status(200).json(result);
    }

    return res.status(405).json({ status: 'error', message: '허용되지 않은 메서드입니다.' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
