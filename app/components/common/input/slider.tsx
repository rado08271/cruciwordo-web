import type {PropsWithChildren} from "react";
import {useEffect, useState} from "react";
import {styled} from 'styled-components';

const sliderProgressTrack = (progress) => (`
    linear-gradient(to right, #888 0, #888 ${ progress }%, #efefef ${ progress }%, #efefef 100%);
`)

const InputSlider = styled.div<{ progress: number; }>`
    display: flex;
    flex-direction: column;
    align-items: start;
    color: #888;
    
    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 1rem;
        outline: none;
        position: relative;
        justify-content: center;
        
        &::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            appearance: none;
            background: ${ props => sliderProgressTrack(props.progress)};
            height: 0.5rem;
            border-radius: 0.5rem;
        }
        

        &::-moz-range-track {
            -webkit-appearance: none;
            appearance: none;
            background: ${ props => sliderProgressTrack(props.progress)};
            height: 0.5rem;
            border-radius: 0.5rem;
        }
        
        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            background: white;
            border: medium solid #888;
            margin-top: -0.25rem;
            width: 1rem;
            aspect-ratio: 1;
            border-radius: 1rem;
            cursor: pointer;
        }

        &::-moz-range-thumb {
            -webkit-appearance: none;
            appearance: none;
            background: white;
            border: 10px solid #888;
            margin-top: -0.25rem;
            width: 1rem;
            aspect-ratio: 1;
            border-radius: 1rem;
            cursor: pointer;
        }
    }
`

type Props = PropsWithChildren&{
    min?: number
    max?: number
    label?: string
    onSlide?: (value: number) => void
    overrideValue: number
}

const Slider = ({children, min, max, onSlide, overrideValue = 0}: Props) => {
    // const [value, setNewValue] = useState<number>(min ?? 0);
    const [overridenValue, setOverridenValue] = useState<number>(min ?? overrideValue);

    return (
        <InputSlider progress={( overrideValue-min )/( max-min ) * 100}>
            <label htmlFor={'input-slider'}>{children}: {overrideValue}</label>
            <input type={'range'} className={'slider'} value={overrideValue} step={1} min={min ?? 0} max={max ?? 100} onChange={event => {

                const range = event.target.value as number;

                // setNewValue(range);

                setOverridenValue(range)
                onSlide && onSlide(range);
            }}/>
        </InputSlider>
    )
};

export default Slider;