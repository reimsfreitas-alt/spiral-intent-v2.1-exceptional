document.addEventListener('DOMContentLoaded', () => {
    const btnOpenSeal = document.getElementById('btn-open-seal');
    const state1 = document.getElementById('state-1');
    const state2 = document.getElementById('state-2');
    const state3 = document.getElementById('state-3');
    const loadingText = document.getElementById('loading-text');
    const demoTimestamp = document.getElementById('demo-timestamp');

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const getFormattedDate = () => {
        const now = new Date();
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const time = now.toTimeString().split(' ')[0];
        return `${day} ${month} ${year} ${time}`;
    };

    if (!btnOpenSeal || !state1 || !state2 || !state3 || !loadingText || !demoTimestamp) return;

    btnOpenSeal.addEventListener('click', async () => {
        state1.classList.remove('active');
        state2.classList.add('active');

        const steps = [
            "> VALIDANDO SELO E CONTRATO...",
            "> VERIFICANDO IDENTIDADE DO DESTINATÁRIO...",
            "> LIBERANDO ACESSO AO ARQUIVO...",
            "> SIMULANDO REGISTRO DO EVENTO..."
        ];

        for (const text of steps) {
            loadingText.innerText = text;
            await sleep(1200);
        }

        demoTimestamp.innerText = getFormattedDate();
        state2.classList.remove('active');
        state3.classList.add('active');

        // A demonstração não acessa um backend nem baixa um arquivo privado real.
        console.log("Spiral Seal demo complete: production backend not connected.");
    });
});
