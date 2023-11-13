/* 
Author Alex Younkers
10/11/2023
This is the Badge Display div
*/

"use client"

import React from 'react';
import  { useState } from 'react';
import axios from 'axios';

import hoopBronze from '../badgeImages/hoopBronze.png';
import hoopSilver from '../badgeImages/hoopSilver.png';
import hoopGold from '../badgeImages/hoopGold.png';
import soccerBronze from '../badgeImages/soccerBronze.png';
import soccerSilver from '../badgeImages/soccerSilver.png';
import soccerGold from '../badgeImages/soccerGold.png';
import tennisBronze from '../badgeImages/tennisBronze.png';
import tennisSilver from '../badgeImages/tennisSilver.png';
import tennisGold from '../badgeImages/tennisGold.png';
import weightBronze from '../badgeImages/weightBronze.png';
import weightSilver from '../badgeImages/weightSilver.png';
import weightGold from '../badgeImages/weightGold.png';
import masterBadge from '../badgeImages/masterBadge.png';


export default function BadgeDisplay({ numTennis, numBasketball, numSoccer, numWeights }) {



    const getBadge = (num, sport, bronze, silver, gold) => {
        if (num >= 75) {
            return gold;
        } else if (num >= 25) {
            return silver;
        } else if (num >= 10) {
            return bronze;
        } else {
            return null;
        }
    };

    const getLabel = (num) => {
        if (num >= 75) {
            return 'Gold';
        } else if (num >= 25) {
            return 'Silver';
        } else if (num >= 10) {
            return 'Bronze';
        } else {
            return null;
        }
    };

    return (
        <div className='py-10'>
        <h1 className='font-bold text-xl'>Badges:</h1>
        <div className="flex space-x-4 justify-center items-center py-10">
            
            {/* Basketball badges */}
            {numBasketball >= 10 && (
              <div className='w-1/4 flex flex-col items-center group'>

                <div className="transition duration-300 ease-in-out transform group-hover:scale-110">
                <img 
                    src={getBadge(numBasketball, "basketball", hoopBronze.src, hoopSilver.src, hoopGold.src)} 
                    alt="Basketball Badge"
                    className="w-full object-contain" 
                />
                </div>
                <span className="text-center text-white bg-black opacity-0 group-hover:opacity-100 px-2 py-1 text-xs transition duration-300 ease-in-out mt-2">
                    {`${getLabel(numBasketball)} Basketball`}
                </span>          
              </div>
            )}

            {/* Tennis badges */}
            {numTennis >= 10 && (
                <div className='w-1/4 flex flex-col items-center group'>

                <div className="transition duration-300 ease-in-out transform group-hover:scale-110">
                <img 
                    src={getBadge(numTennis, "tennis", tennisBronze.src, tennisSilver.src, tennisGold.src)} 
                    alt="Tennis Badge"
                    className="w-full object-contain" 
                />
                </div>

                <span className="text-center text-white bg-black opacity-0 group-hover:opacity-100 px-2 py-1 text-xs transition duration-300 ease-in-out mt-2">
                    {`${getLabel(numTennis)} Tennis`}
                </span>              
              </div>
            )}    

            {/* Soccer badges */}
            {numSoccer >= 10 && (
                <div className='w-1/4 flex flex-col items-center group'>

                <div className="transition duration-300 ease-in-out transform group-hover:scale-110">
                <img 
                    src={getBadge(numSoccer, "soccer", soccerBronze.src, soccerSilver.src, soccerGold.src)} 
                    alt="Soccer Badge"
                    className="w-full object-contain" 
                />
                </div>
                <span className="text-center text-white bg-black opacity-0 group-hover:opacity-100 px-2 py-1 text-xs transition duration-300 ease-in-out mt-2">
                    {`${getLabel(numSoccer)} Soccer`}
                </span>               
              </div>
            )}    

            {/* Weightlifting badges */}
            {numWeights >= 10 && (
                <div className='w-1/4 flex flex-col items-center group'>

                <div className="transition duration-300 ease-in-out transform group-hover:scale-110">
                <img 
                    src={getBadge(numWeights, "weights", weightBronze.src, weightSilver.src, weightGold.src)} 
                    alt="Basketball Badge"
                    className="w-full object-contain" 
                />
                </div>
                <span className="text-center text-white bg-black opacity-0 group-hover:opacity-100 px-2 py-1 text-xs transition duration-300 ease-in-out mt-2">
                    {`${getLabel(numWeights)} Weightlifting`}
                </span>              
              </div>             
            )} 

            {/* Weightlifting badges */}
            {numBasketball >= 10 && numSoccer >= 10 && 
             numTennis >= 10 && numWeights >= 10 && (

                <div className='w-1/4 flex flex-col items-center group'>

                <div className="transition duration-300 ease-in-out transform group-hover:scale-110">
                <img 
                    src={masterBadge.src} 
                    alt="Sport Master Badge"
                    className="w-full object-contain" 
                />
                </div>
                <span className="text-center text-white bg-black opacity-0 group-hover:opacity-100 px-2 py-1 text-xs transition duration-300 ease-in-out mt-2">
                    {"Sport Master"}
                </span>              
              </div>             
            )} 
            
                    


        </div>

        </div>
    );

}