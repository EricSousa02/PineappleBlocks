import jsPDF from "jspdf";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

const adjectives = [
  "Feliz",
  "Criativo",
  "Energético",
  "Animado",
  "Dinâmico",
  "Radiante",
  "Alegre",
  "Vibrante",
  "Alegre",
  "Ensolarado",
  "Cintilante",
  "Brilhante",
  "Radiante",
];

const animals = [
  "Golfinho",
  "Tigre",
  "Elefante",
  "Pinguim",
  "Canguru",
  "Pantera",
  "Leão",
  "Chita",
  "Girafa",
  "Hipopótamo",
  "Macaco",
  "Panda",
  "Crocodilo",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomName(): string {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomAnimal} ${randomAdjective}`;
}

export const getShapeInfo = (shapeType: string) => {
  switch (shapeType) {
    case "rect":
      return {
        icon: "/assets/rectangle.svg",
        name: "Retângulo",
      };

    case "circle":
      return {
        icon: "/assets/circle.svg",
        name: "Círculo",
      };

    case "triangle":
      return {
        icon: "/assets/triangle.svg",
        name: "Triângulo",
      };

    case "line":
      return {
        icon: "/assets/line.svg",
        name: "Linha",
      };

    case "i-text":
      return {
        icon: "/assets/text.svg",
        name: "Texto",
      };

    case "image":
      return {
        icon: "/assets/image.svg",
        name: "Imagem",
      };

    case "freeform":
      return {
        icon: "/assets/freeform.svg",
        name: "Desenho",
      };

    default:
      return {
        icon: "/assets/freeform.svg",
        name: "Desenho",
      };
  }
};

export const exportToPdf = () => {
  const canvas = document.querySelector("canvas");

  if (!canvas) return;

  // usar jspdf
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  // obter a URL de dados do canvas
  const data = canvas.toDataURL();

  // adicionar a imagem ao pdf
  doc.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);

  // baixar o pdf
  doc.save("canvas.pdf");
};
