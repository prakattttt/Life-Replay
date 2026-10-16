"use client";

import { createContext, useCallback, useContext, useState } from "react";

type PhotoPrivacyContextValue = {
  blurPhotos: boolean;
  revision: number;
  setBlurPhotos: (blur: boolean) => void;
};

const PhotoPrivacyContext = createContext<PhotoPrivacyContextValue>({
  blurPhotos: false,
  revision: 0,
  setBlurPhotos: () => {},
});

export function PhotoPrivacyProvider({
  children,
  initialBlurPhotos,
}: {
  children: React.ReactNode;
  initialBlurPhotos: boolean;
}) {
  const [privacy, setPrivacy] = useState({ blurPhotos: initialBlurPhotos, revision: 0 });
  const setBlurPhotos = useCallback((blurPhotos: boolean) => {
    setPrivacy((current) =>
      current.blurPhotos === blurPhotos
        ? current
        : { blurPhotos, revision: current.revision + 1 },
    );
  }, []);

  return (
    <PhotoPrivacyContext.Provider value={{ ...privacy, setBlurPhotos }}>
      {children}
    </PhotoPrivacyContext.Provider>
  );
}

export function usePhotoPrivacy() {
  return useContext(PhotoPrivacyContext);
}