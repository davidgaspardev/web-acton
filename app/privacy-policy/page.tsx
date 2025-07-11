export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidade</h1>
      <p>
        Esta Política de Privacidade explica de forma simples como tratamos os dados dos usuários do sistema Acton.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Quais dados coletamos?</h2>
      <ul className="list-disc ml-6">
        <li>Nome, e-mail, telefone e outros dados fornecidos no cadastro.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Como usamos os dados?</h2>
      <ul className="list-disc ml-6">
        <li>Os dados são usados apenas para funcionamento do sistema da academia Acto.</li>
        <li>Não utilizamos os dados para marketing ou compartilhamento com terceiros.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Onde os dados ficam armazenados?</h2>
      <ul className="list-disc ml-6">
        <li>Os dados são salvos no banco de dados da academia Acto.</li>
        <li>Dados pessoais sensíveis (PII) são criptografados para garantir sua segurança e privacidade.</li>
        <li>Adotamos medidas técnicas adequadas para proteger todas as informações dos usuários.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Seus direitos</h2>
      <ul className="list-disc ml-6">
        <li>Você pode solicitar a atualização ou exclusão dos seus dados a qualquer momento.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Dúvidas</h2>
      <p>Em caso de dúvidas, entre em contato pelo e-mail: suporte@acton.com.br</p>
    </main>
  );
}
