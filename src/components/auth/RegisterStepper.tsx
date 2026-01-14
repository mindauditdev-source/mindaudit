"use client";

interface RegisterStepperProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_TITLES: Record<number, string> = {
  1: "Detalles de la Cuenta",
  2: "Información de Empresa",
  3: "Credenciales Profesionales",
};

const NEXT_STEP_TITLES: Record<number, string> = {
  1: "Información de Empresa",
  2: "Credenciales Profesionales",
  3: "Finalización del perfil",
};

export function RegisterStepper({ currentStep, totalSteps }: RegisterStepperProps) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-4">
        <div className="space-y-1">
          <p className="text-[#0f4c81] text-xs font-black tracking-widest uppercase">
            PASO {currentStep} DE {totalSteps}
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            {STEP_TITLES[currentStep]}
          </h2>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
            {currentStep === totalSteps ? "ÚLTIMO PASO" : "SIGUIENTE"}
          </p>
          <p className="text-slate-600 text-sm font-semibold">
            {NEXT_STEP_TITLES[currentStep]}
          </p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-blue-600 transition-all duration-700 ease-out" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
