import  { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { image, header } from './assets/image.js';
import './App.css';

export default function App() {
  const navigate = useNavigate(); // Initialize useNavigate
  const { user } = useClerk(); // Get the current user

  useEffect(() => {
    // Redirect to /dashboard if user is signed in
    if (user) {
      navigate('/check');
    }
  }, [user, navigate]);



  return (
    <div className='container'>
      <img src={header} className='header-image' alt="Header" />

      <header className='sing-in-containaer'>
        <SignedOut >
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <div className="dev-image">
        <img src={image} alt="" className='image-div' />
      </div>
      </header>



      </div>
  );
}


