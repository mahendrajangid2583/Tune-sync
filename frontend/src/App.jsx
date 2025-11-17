import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import LoginForm from "./pages/Login";
import VerifyEmail from "./pages/verify_Email";
import MyFriendButton from "./components/connect_components/MyFriendButton";
import PlaylistPage from "./pages/playlist";
import { AudioProvider } from "./pages/contexts/AudioProvider";
import { QueueProvider } from "./pages/contexts/queueContext";
import ConnectPage from "./pages/ConnectPage";
import ForgotPasswordForm from "./pages/ForgotPassword";
import ResetPasswordForm from "./pages/resetPassword";
import { ProfileProvider } from "./pages/contexts/profileContext";
import MusicLibrary from "./pages/library";
import { SocketProvider } from "./pages/contexts/SocketContext";
import GroupSidebarButton from "./components/groups_components/GroupSidebarButton";
import { GroupProvider } from "./pages/contexts/GroupContext";
import PrivetRoute from "./components/core/Auth/PrivetRoute";
import useAudioUnlock from "./utils/useAudioUnlock";

function App() {
  const isAudioUnlocked = useAudioUnlock();
  return (
    <div>
      <ProfileProvider>
        <SocketProvider>
          <GroupProvider>
            
            <QueueProvider>
              <AudioProvider>
                {/* <MyFriendButton />
                <GroupSidebarButton /> */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Signup" element={<Signup />} />
                  <Route path="/library" element={<MusicLibrary />} />
                  <Route path="/Login" element={<LoginForm />} />
                  <Route path="/Profile" element={<Profile />} />
                  <Route path="/verification-email" element={<VerifyEmail />} />
                  <Route path="/playlist" element={<PlaylistPage />} />
                  <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
                  
                  <Route path="/connect-page" element={<PrivetRoute>
                    <ConnectPage />
                  </PrivetRoute>} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordForm />}
                  />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordForm />}
                  />
                </Routes>
              </AudioProvider>
            </QueueProvider>
          </GroupProvider>
        </SocketProvider>
      </ProfileProvider>
    </div>
  );
}

export default App;
