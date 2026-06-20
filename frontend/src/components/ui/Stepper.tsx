import { CheckIcon } from '@heroicons/react/24/outline';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
      
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;
        
        return (
          <div key={label} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm
                ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 
                  isCompleted ? 'bg-green-500 text-white' : 
                  'bg-white text-gray-400 border-2 border-gray-200'}`}
            >
              {isCompleted ? <CheckIcon className="h-5 w-5" /> : stepNum}
            </div>
            <span className={`mt-2 text-[10px] uppercase tracking-widest font-black transition-colors ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
