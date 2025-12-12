export interface Character {
    id: string;
    name: string;
    image: string;
}

export const CHARACTERS: Character[] = [
    // --- DEPORTES ---
    { id: 'messi', name: 'Lionel Messi', image: '/images/messi.webp' },
    { id: 'maradona', name: 'Diego Maradona', image: 'https://res.cloudinary.com/dg0okhqyc/image/upload/v1765476040/Gemini_Generated_Image_8enm3y8enm3y8enm_znyotg.png' },
    { id: 'dibu', name: 'Dibu Martínez', image: '/images/dibu.webp' },
    { id: 'scaloni', name: 'Lionel Scaloni', image: '/images/scaloni.webp' },
    { id: 'kun', name: 'Kun Agüero', image: '/images/kun.webp' }, // NUEVO 🆕

    // --- FARÁNDULA & TV ---
    { id: 'fort', name: 'Ricardo Fort', image: 'https://res.cloudinary.com/dg0okhqyc/image/upload/v1765476040/Gemini_Generated_Image_b9t4jub9t4jub9t4_lp60da.png' },
    { id: 'moria', name: 'Moria Casán', image: '/images/moria.webp' },
    { id: 'mirtha', name: 'Mirtha Legrand', image: '/images/mirtha.webp' },
    { id: 'susana', name: 'Susana Giménez', image: '/images/susana.webp' },
    { id: 'wanda', name: 'Wanda Nara', image: '/images/wanda.webp' },
    { id: 'barassi', name: 'Darío Barassi', image: '/images/barassi.webp' },
    { id: 'mauro', name: 'Mauro Viale', image: '/images/mauro.webp' }, // NUEVO 🆕 ("Usted se tiene que arrepentir")
    { id: 'francella', name: 'G. Francella', image: '/images/francella.webp' }, // NUEVO 🆕 ("Hermosa mañana")

    // --- MÚSICA ---
    { id: 'charly', name: 'Charly García', image: '/images/charly.webp' },
    { id: 'biza', name: 'Bizarrap', image: '/images/biza.webp' },
    { id: 'gilda', name: 'Gilda', image: '/images/gilda.webp' },
    { id: 'sandro', name: 'Sandro', image: '/images/sandro.webp' },
    { id: 'lali', name: 'Lali Espósito', image: '/images/lali.webp' }, // NUEVO 🆕
    { id: 'tini', name: 'Tini Stoessel', image: '/images/tini.webp' }, // NUEVO 🆕

    // --- POLÍTICA ---
    { id: 'milei', name: 'Javier Milei', image: '/images/milei.webp' },
    { id: 'cristina', name: 'Cristina Kirchner', image: '/images/cristina.webp' },
    { id: 'macri', name: 'Mauricio Macri', image: '/images/macri.webp' },
    { id: 'favaloro', name: 'René Favaloro', image: '/images/favaloro.webp' }, // NUEVO 🆕 (Respeto máximo)

    // --- FICCIÓN & MEMES ---
    { id: 'pepe', name: 'Pepe Argento', image: '/images/pepe.webp' },
    { id: 'moni', name: 'Moni Argento', image: '/images/moni.webp' },
    { id: 'bananero', name: 'El Bananero', image: '/images/bananero.webp' },
    { id: 'caro', name: 'Caro Pardíaco', image: '/images/caro.webp' },
    { id: 'atendedor', name: 'Atendedor Boludos', image: '/images/atendedor.webp' },
    { id: 'maratea', name: 'Santi Maratea', image: '/images/maratea.webp' },
    { id: 'inimputable', name: 'Viejo Inimputable', image: '/images/inimputable.webp' },
];

// Función utilitaria para obtener 24 personajes al azar
export function getRandomBoard() {
    // Copiamos el array para no mutar el original
    const shuffled = [...CHARACTERS].sort(() => 0.5 - Math.random());
    // Devolvemos los primeros 24
    return shuffled.slice(0, 24);
}