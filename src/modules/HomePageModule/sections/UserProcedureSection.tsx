'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FEATURE_STEPS } from '../constant';

export const UserProcedureSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % FEATURE_STEPS.length);
      setProgress(0);
    }, 5000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, []);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
  };

  return (
    <section
      id="procedure"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium mb-6 md:mb-8 shadow-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-4">
            See <span className="text-orange-500">Boundless</span> in Action
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Experience how our AI-powered platform transforms your study abroad journey with intelligent matching and personalized guidance
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-3 md:space-y-4">
            {FEATURE_STEPS.map((step, index) => (
              <div
                key={step.title}
                onClick={() => handleStepClick(index)}
                className={`relative p-4 md:p-6 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 ease-out border ${
                  activeStep === index
                    ? `bg-white shadow-xl ${step.accentColor} border-2`
                    : 'bg-white border-gray-200 hover:shadow-lg hover:border-gray-300'
                }`}
              >
                {activeStep === index && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 rounded-t-xl md:rounded-t-2xl overflow-hidden">
                    <div 
                      className={`h-full ${step.bgColor} transition-all duration-100 ease-out`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`${step.bgColor} text-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0 shadow-sm transition-transform duration-300 ${
                    activeStep === index ? 'scale-110' : ''
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <h3 className="text-base md:text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
                      {step.status === 'in-development' && (
                        <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">
                          In Development
                        </span>
                      )}
                      {step.status === 'coming-soon' && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative lg:sticky lg:top-8">
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-xl border border-gray-200 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-100">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-400 rounded-full"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-xs md:text-sm text-gray-500 font-medium">
                  {FEATURE_STEPS[activeStep].title}
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gray-100">
                <Image
                  key={activeStep}
                  src={FEATURE_STEPS[activeStep].illustration}
                  alt={FEATURE_STEPS[activeStep].title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded-lg md:rounded-xl transition-opacity duration-500 ease-in-out"
                />
              </div>
              
              <div className="flex justify-center mt-4 md:mt-6 gap-2 md:gap-3">
                {FEATURE_STEPS.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      activeStep === index 
                        ? `${step.bgColor} scale-125 shadow-sm` 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};