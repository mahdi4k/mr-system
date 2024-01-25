"use client"
import React, {useState} from 'react'
import {Stepper} from '@mantine/core';
import Step1Form from "./step1-form";
import Step2Image from "./step2-image";

export type ActiveStepDTO = 'step-1' | 'step-2'
const Motherboard = () => {
    const [activeStep, setActiveStep] = useState<ActiveStepDTO>('step-1')
    const [active, setActive] = useState(0);

    return (
        <>
            <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step allowStepSelect={activeStep === 'step-1'} label="مرحله اول" description="ثبت فرم">
                    <Step1Form setActive={setActive} setActiveStep={setActiveStep}/>
                </Stepper.Step>
                <Stepper.Step label="مرحله دو" allowStepSelect={activeStep === 'step-2'} description="افزودن تصویر">
                    <Step2Image setActive={setActive} setActiveStep={setActiveStep}/>
                </Stepper.Step>
            </Stepper>

        </>
    )
}

export default Motherboard
