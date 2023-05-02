"use client";

import React, { useState } from 'react';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { Slider, SliderSingleProps } from 'antd';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const MESSAGES = {
  uncertainty: ' Incerteza',
  complexity: 'Complexidade',
  points: new Map([
    [1, { icon: '🛴', title: '1 Ponto' }],
    [2, { icon: '🚲', title: '2 Pontos' }],
    [3, { icon: '🛵', title: '3 Pontos' }],
    [5, { icon: '🚗 ', title: '5 Pontos' }],
    [8, { icon: '🚛', title: '8 Pontos' }],
    [13, { icon: '🚤', title: '13 Pontos' }],
    [20, { icon: '🚁', title: '20 Pontos' }],
    [40, { icon: '🛩', title: '40 Pontos' }],
    [100, { icon: '🚀', title: '100 Pontos' }],
  ]),
  description: new Map([
    ['complexityHigh', 'Complexidade e o esforço para entregar está alta, que tal DIVIDIR a tarefa em partes menores?'],
    ['uncertaintyHigh', 'Incerteza técnica e/ou de negócio está alta, que tal REFINAR a tarefa?'],
    ['ok', 'Tudo certo! Tarefa com tamanho ideal.']
  ])
}

const RANGE_OPTIONS = [
  { value: 1, label: 'Mínima' },
  { value: 2, label: 'Pouca' },
  { value: 3, label: 'Moderada' },
  { value: 4, label: 'Extrema' },
  { value: 5, label: 'Máxima' }
]

const MATRIX = [
  [1, 2, 3, 5, 8],
  [2, 3, 5, 8, 13],
  [3, 5, 8, 13, 20],
  [5, 8, 13, 20, 40],
  [8, 13, 20, 40, 100],
];

const LIMIT_POINTS_TO_UNCERTAINTY = 3

const LIMIT_POINTS_TO_COMPLEXITY = 3

type FormProps = {};

type FormData = {
  uncertainty: number;
  complexity: number;
};

const IconSlider: React.FC<SliderSingleProps> = (props) => {
  const { max, min, value } = props;
  const mid = Number((((max || 0) - (min || 0)) / 2).toFixed(5));
  const preColorCls = (value || 0) > mid ? '' : 'icon-wrapper-active';
  const nextColorCls = (value || 0) > mid ? 'icon-wrapper-active' : '';

  return (
    <div className="icon-wrapper">
      <SmileOutlined className={preColorCls} />
      <Slider {...props} />
      <FrownOutlined className={nextColorCls} />
    </div>
  );
};

const Home: React.FC<FormProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    uncertainty: 0,
    complexity: 0,
  });

  const handleInputChange = (
    value: number,
    field: keyof FormData
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const result = MATRIX[formData.uncertainty][formData.complexity];

  const formatter = (value: any) => RANGE_OPTIONS[value].label;

  const description = () => {
    if (formData.complexity >= LIMIT_POINTS_TO_COMPLEXITY) {
      return MESSAGES.description.get('complexityHigh')
    }

    if (formData.uncertainty >= LIMIT_POINTS_TO_UNCERTAINTY) {
      return MESSAGES.description.get('uncertaintyHigh')
    }

    return MESSAGES.description.get('ok')
  }

  const contextBackgroundColorClass = () => {
    if (formData.complexity >= LIMIT_POINTS_TO_COMPLEXITY) {
      return 'bg-red-200'
    }

    if (formData.uncertainty >= LIMIT_POINTS_TO_UNCERTAINTY) {
      return 'bg-yellow-200'
    }

    return 'bg-green-200'
  }

  return (
    <main className={`min-h-screen text-center bg-white ${inter.className}`}>
      {
        MESSAGES.points.get(result) &&
        <section
          className={`grid content-center ${contextBackgroundColorClass()}`}
          style={{ gridArea: 'result' }}
        >
          <p className="leading-normal text-8xl">
            {MESSAGES.points.get(result)?.icon}
          </p>
          <p className="text-5xl font-bold leading-normal">
            {MESSAGES.points.get(result)?.title}
          </p>
          <p className="max-w-2xl mx-auto text-3xl leading-snug line">
            {description()}
          </p>
        </section>
      }

      <form
        className='grid content-center gap-12 justify-self-center'
        style={{ gridArea: 'form', minWidth: '800px' }
        }
      >
        <fieldset>
          <p className="mb-4 text-2xl">
            {MESSAGES.uncertainty}
          </p>
          <IconSlider
            min={0} max={4}
            value={formData.uncertainty}
            tooltip={{ formatter }}
            onChange={value => handleInputChange(value, 'uncertainty')}
          />
        </fieldset>

        <fieldset>
          <p className="mb-4 text-2xl">
            {MESSAGES.complexity}
          </p>
          <IconSlider
            min={0} max={4}
            value={formData.complexity}
            tooltip={{ formatter }}
            onChange={value => handleInputChange(value, 'complexity')}
          />
        </fieldset>
      </form>
    </main>
  );
};

export default Home;