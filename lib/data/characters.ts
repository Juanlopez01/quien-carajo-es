export interface Character {
    id: string;
    name: string;
    image: string;
}

export const CHARACTERS: Character[] = [
    // --- DEPORTES ---
    { id: 'messi', name: 'Lionel Messi', image: 'https://c4.wallpaperflare.com/wallpaper/1001/743/752/argentina-fifa-world-cup-lionel-messi-hd-wallpaper-preview.jpg' },
    { id: 'maradona', name: 'Diego Maradona', image: 'https://res.cloudinary.com/dg0okhqyc/image/upload/v1765476040/Gemini_Generated_Image_8enm3y8enm3y8enm_znyotg.png' },
    { id: 'dibu', name: 'Dibu Martínez', image: 'https://intn24.lalr.co/cms/2024/07/05131615/EmilianoDibumartinezAFP.jpg' },
    { id: 'scaloni', name: 'Lionel Scaloni', image: 'https://i.pinimg.com/736x/26/69/f7/2669f7b8a2e3c441cef418651987410a.jpg' },
    { id: 'kun', name: 'Kun Agüero', image: 'https://w0.peakpx.com/wallpaper/827/885/HD-wallpaper-kun-aguero-argentina-city-futbol-kunsito-manchester-city-sergio-sergio-aguero-streamer.jpg' }, // NUEVO 🆕

    // --- FARÁNDULA & TV ---
    { id: 'fort', name: 'Ricardo Fort', image: 'https://res.cloudinary.com/dg0okhqyc/image/upload/v1765476040/Gemini_Generated_Image_b9t4jub9t4jub9t4_lp60da.png' },
    { id: 'moria', name: 'Moria Casán', image: 'https://pbs.twimg.com/profile_images/1621038903154049025/hxlYJTX8_400x400.jpg' },
    { id: 'mirtha', name: 'Mirtha Legrand', image: 'https://www.parati.com.ar/wp-content/uploads/2024/01/DESTACADA-mirtha-legrand.jpg' },
    { id: 'susana', name: 'Susana Giménez', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2017/06/24202348/Susana-Gimenez-19201.jpg' },
    { id: 'wanda', name: 'Wanda Nara', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/C7UOWSK3ONGA5O6QHQ5EO32FKU.jpg' },
    { id: 'barassi', name: 'Darío Barassi', image: 'https://fotos.perfil.com/2024/03/25/trim/950/534/dario-barassi-1775890.jpg' },
    { id: 'mauro', name: 'Mauro Viale', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/WYK3TMBLRVG4PLKGCJ3DBCLOVY.jpg' }, // NUEVO 🆕 ("Usted se tiene que arrepentir")
    { id: 'francella', name: 'G. Francella', image: 'https://images2.alphacoders.com/139/thumb-1920-1394056.png' }, // NUEVO 🆕 ("Hermosa mañana")

    // --- MÚSICA ---
    { id: 'charly', name: 'Charly García', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/02/01152622/Charly-Garcia-habla-sobre-el-hombre-que-subio-armado.jpg' },
    { id: 'biza', name: 'Bizarrap', image: 'https://media.pitchfork.com/photos/62053f3f7db00b3b97548d5e/4:3/w_4340,h_3255,c_limit/CROP%20Bizarrap%208%20sept%202021%20-%20prensa22980%20(1).jpg' },
    { id: 'gilda', name: 'Gilda', image: 'https://cuatrobastardosdotcom.wordpress.com/wp-content/uploads/2016/09/gilda-tapa.jpg' },
    { id: 'sandro', name: 'Sandro', image: 'https://cdn.luna.com.uy/escaramuza.com.uy/files/tmp/compressed/normal/jlfu9zug0ggw1oz7btny.jpg' },
    { id: 'lali', name: 'Lali Espósito', image: 'https://dwgyu36up6iuz.cloudfront.net/heru80fdn/image/upload/c_fill,d_placeholder_voguemexico.png,fl_progressive,g_face,h_1080,q_80,w_1920/v1689193699/voguemexico_secretos-de-belleza-de-lali-esposito-para-un-look-clasico-con-labios-rojos.jpg' }, // NUEVO 🆕
    { id: 'tini', name: 'Tini Stoessel', image: 'https://media.vogue.mx/photos/6169d44bd57872f331cc3228/master/pass/Tini-entrevista-Vogue-M%C3%A9xico.jpg' }, // NUEVO 🆕

    // --- POLÍTICA ---
    { id: 'milei', name: 'Javier Milei', image: 'https://proassets.planetadelibros.com.ar/usuaris/autores/fotos/81/original/000080089_1_JavierMilei_202404111611.jpg' },
    { id: 'cristina', name: 'Cristina Kirchner', image: 'https://www.infobae.com/new-resizer/oyQQK-00ePM4Cs5JhROTHGPaiZo=/arc-anglerfish-arc2-prod-infobae/public/6CMQPM653ZCY3P2UAB3PPEQKU4.jpg' },
    { id: 'macri', name: 'Mauricio Macri', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/12/03194830/Mauricio-Macri-entrevista-AP-3.jpg' },
    { id: 'favaloro', name: 'René Favaloro', image: 'https://www.cadenasudeste.com/vistas/fotos_noticias/10925-YDWRVQVLHRCIFIPTUXNI6ESROI.jpg' }, // NUEVO 🆕 (Respeto máximo)

    // --- FICCIÓN & MEMES ---
    { id: 'tinelli', name: 'M. Tinelli', image: 'https://www.infohd.com.ar/wp-content/uploads/2021/03/MarceloTinelli1.jpg' },
    { id: 'moni', name: 'Moni Argento', image: 'https://nexodiario.com/wp-content/uploads/2018/02/moni-argento.jpg' },
    { id: 'bananero', name: 'El Bananero', image: 'https://imgs.elpais.com.uy/dims4/default/b81489e/2147483647/strip/false/crop/607x476+0+0/resize/1200x941!/quality/90/?url=https%3A%2F%2Fel-pais-uruguay-production-web.s3.us-east-1.amazonaws.com%2Fbrightspot%2Ff9%2Fae%2F447bcd6a4585b9c99bebfe53259c%2Fcaptura-de-pantalla-2025-02-13-154954.png' },
    { id: 'caro', name: 'Caro Pardíaco', image: 'https://tn.com.ar/resizer/_MqJZrowfilzNy78PIfr2Bc559o=/arc-anglerfish-arc2-prod-artear/public/CBBHAC7UFRG5DO3WZOU5JS5KCY.png' },
    { id: 'atendedor', name: 'Atendedor Boludos', image: 'https://pbs.twimg.com/media/GHtcJ3hWIAAAgl1.jpg' },
    { id: 'maratea', name: 'Santi Maratea', image: 'https://media.a24.com/p/368ef9a27bc5b805dc7a27ff65002e57/adjuntos/296/imagenes/009/590/0009590769/1200x675/smart/santi-maratea.png' },
];

// Función utilitaria para obtener 24 personajes al azar
export function getRandomBoard() {
    // Copiamos el array para no mutar el original
    const shuffled = [...CHARACTERS].sort(() => 0.5 - Math.random());
    // Devolvemos los primeros 24
    return shuffled.slice(0, 24);
}