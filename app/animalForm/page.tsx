"use client";

import "primereact/resources/themes/saga-orange/theme.css";
import "primeicons/primeicons.css";
import AnimalSheetForm from "@/components/AnimalSheetForm";
import { PetProfileData } from "@/components/AnimalSheetForm";

export default function AnimalFormPage() {

  const handleSuccess = (animalData: PetProfileData) => {
    console.log("Animal profile created successfully:", animalData);
  };

  return (
    <>
      <AnimalSheetForm onSuccess={handleSuccess} />
    </>
  );
}