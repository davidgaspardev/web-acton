export type PopUpProperties = {
  onClick: () => void
}

export default function PopUp(props: PopUpProperties): JSX.Element {
  const { onClick } = props;

  return (
    <div className="fixed top-0 end-0 bottom-0 left-0 bg-[#00000075] flex justify-center items-center z-50">
      <div className="max-w-[320px] w-full min-h-[100px] bg-white rounded-lg">
        <div className="p-6 text-center">
          <h1 className="font-bold mb-4 text-[#67696F] text-lg">Obrigado por realizar seu mapeamento de sintomas conosco!</h1>
          <h4  className="text-[#67696F] mb-4 text-sm">O primeiro passo em busta de mais saúde e diposição já foi dado por você.</h4>
          <h4 className="text-[#67696F] mb-4 text-sm">Em breve nosso time de especialista entrará em contato para mais informações.</h4>

          <button
           className="w-[calc(100%-32px)] h-8 mt-2 bg-[#E8E8E8] text-[#E13A1A] rounded-full"
           onClick={onClick}>FECHAR</button>
        </div>
      </div>
    </div>
  );
}
