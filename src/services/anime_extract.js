const { AxiosService } = require('../helper/axios_service');

async function extractVideo(url) {
    try {
        // 1. Validasi Input
        if (!url) return { status: "fail", message: "URL tidak boleh kosong" };

        // 2. Buka URL (Pura-pura jadi Browser Chrome PC)
        const response = await AxiosService(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.google.com/',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });

        const html = response.data;

        // 3. Jurus Regex (Cari teks apapun yang berakhiran .m3u8)
        // Pola: http.....m3u8.... (berhenti di tanda kutip/spasi)
        const regex = /(https?:\/\/[^"';\s>]+\.m3u8[^"';\s>]*)/g;
        const matches = html.match(regex);

        if (matches && matches.length > 0) {
            // Harta Karun Ditemukan!
            return { 
                status: "success", 
                source: url,
                // Ambil hasil pertama, dan bersihkan dari karakter sampah jika ada
                result: matches[0].replace(/\\/g, '') 
            };
        } else {
            return { status: "fail", message: "Link .m3u8 tidak ditemukan di dalam kode HTML target." };
        }

    } catch (e) {
        return { status: "error", message: e.message };
    }
}

module.exports = { extractVideo };
