export function slugify(str: string): string {
  return str
    .normalize("NFD") // enlève les accents
    .replace(/[\u0300-\u036f]/g, "") // supprime les marques diacritiques
    .toLowerCase() // passe en minuscule
    .trim() // enlève les espaces autour
    .replace(/\s+/g, "-") // remplace espaces par tirets
    .replace(/[^a-z0-9\-]/g, "") // supprime tout ce qui n'est pas alphanum ou tiret
}
