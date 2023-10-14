"use client"
import React, { useState} from 'react'
import {Stepper} from '@mantine/core';
import Step1Form from "./step1-form";
import Step2Image from "./step2-image";


const Motherboard = () => {
    const [active, setActive] = useState(0);

    return (
        <>
            <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step label="مرحله اول" description="ثبت فرم">
                    <Step1Form/>
                </Stepper.Step>
                <Stepper.Step label="مرحله دو" description="افزودن تصویر">
                    <Step2Image/>
                </Stepper.Step>

            </Stepper>

        </>
    )
}

export default Motherboard
