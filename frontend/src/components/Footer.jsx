import React from 'react'
import styled from 'styled-components'
// import { BsFacebook } from "react-icons/bs";
// import { BsInstagram } from "react-icons/bs";
// import { BsTwitter } from "react-icons/bs";
// import { BsLinkedin } from "react-icons/bs";
// import { NavLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='bg-blue-950 pt-20 text-sm text-white'>
            <div className="w-[90%] mx-auto grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20 text-center xs:text-left">
                <div className="footer-1">
                    <NavLink href="/" className="footer-logo"><h4 className='text-xl font-semibold'>ECOMMERCE</h4></NavLink>
                    <p className='text-sm mt-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi cum quis delectus.</p>
                </div>
                <div className="footer-2">
                    <h4 className='mb-5 text-white font-bold'>Permalinks</h4>
                    <ul className="permalinks">
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Home</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>About</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Courses</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Contact</NavLink></li>
                    </ul>
                </div>
                <div className="footer-3">
                    <h4 className='mb-5 text-white font-bold'>Privacy</h4>
                    <ul className="privacy">
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Privace Policy</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Terms and Conditions</NavLink></li>
                        <li className='mb-3'><NavLink to='' className='hover:underline'>Refund Policy</NavLink></li>
                    </ul>
                </div>
                <div className="footer-4">
                    <h4 className='mb-5 text-white font-bold'>Contact Us</h4>
                    <div>
                        <p>+01 234 567 8910</p>
                        <p>egator999@gmail.com</p>
                    </div>
                    <div className="mt-8 flex gap-4 justify-center xs:justify-normal">
                        <li className='mb-3'> <NavLink to=''> <FacebookIcon style={{fontSize: '25px', color: 'white'}}/> </NavLink> </li>
                        <li className='mb-3'> <NavLink to=''> <InstagramIcon style={{fontSize: '25px', color: 'white'}}/> </NavLink> </li>
                        <li className='mb-3'> <NavLink to=''> <LinkedInIcon style={{fontSize: '25px', color: 'white'}}/> </NavLink> </li>
                        <li className='mb-3'> <NavLink to=''> <TwitterIcon style={{fontSize: '25px', color: 'white'}}/> </NavLink> </li>
                    </div>
                </div>
            </div>
            <div className="text-center py-5 mt-5 lg:mt-16 border-t-2 border-blue-900">
                <small>Copyright &copy; Ecommerce</small>
            </div>
        </div>
    )
}

const Wrapper = styled.footer`
  background: ${({theme})=>theme.colors.bg1};
  padding-top: 80px;
  font-size: 14.4px;
  color: ${({theme})=>theme.colors.white};
  a{
    color: ${({theme})=>theme.colors.white};
  }
  .footer-container{
      display: grid;
      grid-template-columns: repeat(4,1fr);
      gap: 80px;
  }
  .footer-container > div h4{
      margin-bottom: 19.2px;
      color: ${({theme})=>theme.colors.white};
  }
  .footer-1 p{
      margin: 0 0 32px;
      font-size: 14px;
  }
  .footer-container ul li{
      margin-bottom: 11.2px;
  }
  .footer-container ul li a:hover{
      text-decoration: underline;
  }
  .footer-socials{
      margin-top: 32px;
      display: flex;
      gap: 16px;
      font-size: 19px;
  }
  .footer-copyright{
      text-align: center;
      padding: 19.2px 0;
      margin-top: 64px;
      border-top: 1px solid ${({theme})=>theme.colors.bg2};
  } 
  @media screen and (max-width: ${({theme})=>theme.media.tab}){
    .footer-container{
      grid-template-columns: 1fr 1fr;
    }      
  }
  @media screen and (max-width: ${({theme})=>theme.media.mobile}){
    .footer-container{
      grid-template-columns: 1fr;
      text-align: center;
      gap: 32px;
    }
    .footer-1 p{
      margin-bottom: 10px;
    }
    .footer-socials{
      justify-content: center;
    }
    .footer-copyright{
      margin-top: 30px;
    }
  }
`

export default Footer