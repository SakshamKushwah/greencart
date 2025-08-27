import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className="relative mt-24">
      {/* Desktop Banner */}
      <img
        src={assets.bottom_banner_image}
        alt="banner"
        className="w-full hidden md:block"
      />

      {/* Mobile Banner */}
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden"
      />

      {/* Overlay Content */}
      <div className="absolute top-16 md:top-24 inset-x-0 flex flex-col items-center md:items-end justify-start text-center md:text-right px-4 md:pr-24">
        <div className="bg-white/80 md:bg-transparent rounded-xl p-4 md:p-0 max-w-[90%] md:max-w-lg">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
            Why We Are the Best
          </h1>

          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 md:gap-4 text-left"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-9 md:w-11"
                />
                <div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomBanner
