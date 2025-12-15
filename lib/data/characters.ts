export interface Character {
    id: string;
    name: string;
    image: string;
}

export const CHARACTERS: Character[] = [
    // --- DEPORTES ---
    { id: 'messi', name: 'Lionel Messi', image: 'https://cdn.britannica.com/35/238335-050-2CB2EB8A/Lionel-Messi-Argentina-Netherlands-World-Cup-Qatar-2022.jpg' },
    { id: 'maradona', name: 'Diego Maradona', image: 'https://res.cloudinary.com/dg0okhqyc/image/upload/v1765476040/Gemini_Generated_Image_8enm3y8enm3y8enm_znyotg.png' },
    { id: 'dibu', name: 'Dibu Martínez', image: 'https://intn24.lalr.co/cms/2024/07/05131615/EmilianoDibumartinezAFP.jpg' },
    { id: 'scaloni', name: 'Lionel Scaloni', image: 'https://i.pinimg.com/736x/26/69/f7/2669f7b8a2e3c441cef418651987410a.jpg' },
    { id: 'kun', name: 'Kun Agüero', image: 'https://w0.peakpx.com/wallpaper/827/885/HD-wallpaper-kun-aguero-argentina-city-futbol-kunsito-manchester-city-sergio-sergio-aguero-streamer.jpg' }, // NUEVO 🆕
    { id: 'riquelme', name: 'Juan Román Riquelme', image: 'https://i.pinimg.com/736x/73/63/61/736361ac30384c874785426b433fc981.jpg' },
    { id: 'tevez', name: 'Carlos Tévez', image: 'https://pbs.twimg.com/media/EyFhAZpXMAAXnYG.jpg' },
    { id: 'palermo', name: 'Martín Palermo', image: 'https://i.pinimg.com/736x/3c/da/9c/3cda9c9906f857f8777305fe400769fb.jpg' },
    { id: 'julian', name: 'Julián Álvarez', image: 'https://i.pinimg.com/originals/ce/2f/54/ce2f54abd11cec7367a3908c84873d8f.jpg' },
    { id: 'bilardo', name: 'Carlos Bilardo', image: 'https://www.infocielo.com/wp-content/uploads/2024/12/bilardojpg-5-1068x601.jpg' },
    { id: 'ginobili', name: 'Manu Ginóbili', image: 'https://wallpapers.com/images/hd/manu-ginobili-spurs-black-jersey-js7ez7xe7mv7i6e2.jpg' },
    { id: 'delpotro', name: 'Juan Martín del Potro', image: 'https://www.radiogol.com.ar/wp-content/uploads/2022/02/del-potro-buenos-aires-rio-de-janeiro-2022-wild-cards.jpg' },
    { id: 'monzon', name: 'Carlos Monzón', image: 'https://media.airedesantafe.com.ar/p/16b3bd3dd090d4668ab087fac5bcc223/adjuntos/268/imagenes/003/337/0003337178/carlos-monzon-portada.jpeg' },
    { id: 'ruggeri', name: 'Oscar Ruggeri', image: 'https://fotos.perfil.com/2022/07/19/trim/720/410/oscar-ruggeri-afa-1388700.jpg' },
    { id: 'mostaza', name: 'Mostaza Merlo', image: 'https://pbs.twimg.com/media/Fk8RD5zXEAAigku.jpg' },
    { id: 'caruso', name: 'Caruso Lombardi', image: 'https://fotos.perfil.com/2020/04/08/trim/1280/720/caruso-lombardi-080420-937304.jpg' },
    { id: 'copola', name: 'Guillermo Coppola', image: 'https://nuevospapeles.com/wp-content/uploads/2024/03/coppola-y-maradona.jpg' },
    { id: 'chiqui', name: 'Chiqui Tapia', image: 'https://www.estacionsur.ar/wp-content/uploads/2023/06/chiqui-tapia.jpeg' },
    { id: 'lavezzi', name: 'Pocho Lavezzi', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Ezequiel_Lavezzi.jpg' },

    // --- FARÁNDULA & TV ---
    { id: 'fort', name: 'Ricardo Fort', image: 'https://res.cloudinary.com/dg0okhqyc/image/upload/v1765476040/Gemini_Generated_Image_b9t4jub9t4jub9t4_lp60da.png' },
    { id: 'moria', name: 'Moria Casán', image: 'https://pbs.twimg.com/profile_images/1621038903154049025/hxlYJTX8_400x400.jpg' },
    { id: 'mirtha', name: 'Mirtha Legrand', image: 'https://www.parati.com.ar/wp-content/uploads/2024/01/DESTACADA-mirtha-legrand.jpg' },
    { id: 'susana', name: 'Susana Giménez', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2017/06/24202348/Susana-Gimenez-19201.jpg' },
    { id: 'wanda', name: 'Wanda Nara', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/C7UOWSK3ONGA5O6QHQ5EO32FKU.jpg' },
    { id: 'barassi', name: 'Darío Barassi', image: 'https://fotos.perfil.com/2024/03/25/trim/950/534/dario-barassi-1775890.jpg' },
    { id: 'mauro', name: 'Mauro Viale', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/WYK3TMBLRVG4PLKGCJ3DBCLOVY.jpg' }, // NUEVO 🆕 ("Usted se tiene que arrepentir")
    { id: 'francella', name: 'G. Francella', image: 'https://images2.alphacoders.com/139/thumb-1920-1394056.png' }, // NUEVO 🆕 ("Hermosa mañana")
    { id: 'guido', name: 'Guido Kaczka', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/VXIVWT47MZFMVLCN3TNBLUVUAQ.jpg' },
    { id: 'pampita', name: 'Pampita', image: 'https://lv7.com.ar/wp-content/uploads/2025/09/pampita2.jpg' },
    { id: 'china', name: 'China Suárez', image: 'https://fotos.perfil.com///2024/10/17/900/0/la-china-suarez-1893819.jpeg' },
    { id: 'yanina', name: 'Yanina Latorre', image: 'https://fotos.perfil.com/2025/03/17/0/900/yanina-latorre-1986660.jpg' },
    { id: 'rial', name: 'Jorge Rial', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/3JMYOK43WZF4NCPJUKYR2STRUM.jpg' },
    { id: 'ventura', name: 'Luis Ventura', image: 'https://d3b5jqy5xuub7g.cloudfront.net/wp-content/uploads/2025/10/COVER-art-LMCA-Luis-Ventura-MF-Streaming-min.png' },
    { id: 'caniggia', name: 'Alex Caniggia', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/MYXZGPCS6BCV5HJBSTHRDPXDTQ.jpg' },

    // --- MÚSICA ---
    { id: 'charly', name: 'Charly García', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/02/01152622/Charly-Garcia-habla-sobre-el-hombre-que-subio-armado.jpg' },
    { id: 'biza', name: 'Bizarrap', image: 'https://media.pitchfork.com/photos/62053f3f7db00b3b97548d5e/4:3/w_4340,h_3255,c_limit/CROP%20Bizarrap%208%20sept%202021%20-%20prensa22980%20(1).jpg' },
    { id: 'gilda', name: 'Gilda', image: 'https://cuatrobastardosdotcom.wordpress.com/wp-content/uploads/2016/09/gilda-tapa.jpg' },
    { id: 'sandro', name: 'Sandro', image: 'https://cdn.luna.com.uy/escaramuza.com.uy/files/tmp/compressed/normal/jlfu9zug0ggw1oz7btny.jpg' },
    { id: 'lali', name: 'Lali Espósito', image: 'https://dwgyu36up6iuz.cloudfront.net/heru80fdn/image/upload/c_fill,d_placeholder_voguemexico.png,fl_progressive,g_face,h_1080,q_80,w_1920/v1689193699/voguemexico_secretos-de-belleza-de-lali-esposito-para-un-look-clasico-con-labios-rojos.jpg' }, // NUEVO 🆕
    { id: 'tini', name: 'Tini Stoessel', image: 'https://media.vogue.mx/photos/6169d44bd57872f331cc3228/master/pass/Tini-entrevista-Vogue-M%C3%A9xico.jpg' }, // NUEVO 🆕
    { id: 'rodrigo', name: 'El Potro Rodrigo', image: 'https://media.diariopopular.com.ar/p/7bdc69317a839366a792e46c2204ad1c/adjuntos/143/imagenes/006/798/0006798753/potrojpg.jpg' },
    { id: 'cerati', name: 'Gustavo Cerati', image: 'https://e1.pxfuel.com/desktop-wallpaper/495/141/desktop-wallpaper-gustavo-cerati-by-didiluv-gustavo-cerati.jpg' },
    { id: 'duki', name: 'Duki', image: 'https://images6.alphacoders.com/134/1344142.png' },
    { id: 'lgante', name: 'L-Gante', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/5A7QJNERTFAMBEXZY5MADSXNGA.jpg' },
    { id: 'mona', name: 'La Mona Jiménez', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2019/03/31175302/Lollapalooza-2019-Dia-3-Domingo-1.jpg' },
    { id: 'indio', name: 'Indio Solari', image: 'https://pbs.twimg.com/media/Enl7uSPXUAEeg3r.jpg' },
    { id: 'spinetta', name: 'Luis A. Spinetta', image: 'https://i.pinimg.com/736x/f5/09/ff/f509ff7683210757986686026ff3383d.jpg' },
    { id: 'fito', name: 'Fito Páez', image: 'https://i1.sndcdn.com/artworks-000044413019-knu3cs-t500x500.jpg' },
    { id: 'mercedes', name: 'Mercedes Sosa', image: 'https://cultura.vivamoscomodoro.gob.ar/images/Mercedes_Sosa.jpg' },
    { id: 'pity', name: 'Pity Álvarez', image: 'https://elsiestero.com.ar/wp-content/uploads/2021/06/pity_xlvarez_portada.jpg_423682103.jpg' },
    { id: 'chaqueno', name: 'Chaqueño Palavecino', image: 'https://www.almamusic.net.ar/wp-content/uploads/2021/03/Chaquenoalmamusic.jpg' },
    { id: 'nicki', name: 'Nicki Nicole', image: 'https://media.glamour.mx/photos/6190657da6e030d6480f7923/4:3/w_1400,h_1050,c_limit/237996.jpg' },
    { id: 'nathy', name: 'Nathy Peluso', image: 'https://media.revistavanityfair.es/photos/6315df18fb7396f0da115d8b/4:3/w_2928,h_2196,c_limit/DL_u501015_171%20(1).jpg' },
    { id: 'pocho', name: 'Pocho La Pantera', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2016/10/25210834/pocho_3.jpg' },
    { id: 'calamaro', name: 'Andrés Calamaro', image: 'https://www.mondosonoro.com/wp-content/uploads/2022/09/Calamaro.JavierSalas.jpg' },

    // --- POLÍTICA ---
    { id: 'milei', name: 'Javier Milei', image: 'https://proassets.planetadelibros.com.ar/usuaris/autores/fotos/81/original/000080089_1_JavierMilei_202404111611.jpg' },
    { id: 'cristina', name: 'Cristina Kirchner', image: 'https://www.infobae.com/new-resizer/oyQQK-00ePM4Cs5JhROTHGPaiZo=/arc-anglerfish-arc2-prod-infobae/public/6CMQPM653ZCY3P2UAB3PPEQKU4.jpg' },
    { id: 'macri', name: 'Mauricio Macri', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/12/03194830/Mauricio-Macri-entrevista-AP-3.jpg' },
    { id: 'favaloro', name: 'René Favaloro', image: 'https://www.cadenasudeste.com/vistas/fotos_noticias/10925-YDWRVQVLHRCIFIPTUXNI6ESROI.jpg' }, // NUEVO 🆕 (Respeto máximo)
    { id: 'alfonsin', name: 'Raúl Alfonsín', image: 'https://arc-anglerfish-arc2-prod-infobae.s3.amazonaws.com/public/BUHBMSZJ4NDT5PLJ2OO66QSF7U.jpg' },
    { id: 'che', name: 'Che Guevara', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/CheHigh.jpg/1598px-CheHigh.jpg' },
    { id: 'sanmartin', name: 'San Martín', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Retrato_m%C3%A1s_can%C3%B3nico_de_Jos%C3%A9_de_San_Mart%C3%ADn.jpg/960px-Retrato_m%C3%A1s_can%C3%B3nico_de_Jos%C3%A9_de_San_Mart%C3%ADn.jpg' },
    { id: 'belgrano', name: 'Manuel Belgrano', image: 'https://i.pinimg.com/736x/03/f5/4b/03f54b677a33b69df99d66067abe91e2.jpg' },

    // --- FICCIÓN & MEMES ---
    { id: 'tinelli', name: 'M. Tinelli', image: 'https://www.infohd.com.ar/wp-content/uploads/2021/03/MarceloTinelli1.jpg' },
    { id: 'moni', name: 'Moni Argento', image: 'https://nexodiario.com/wp-content/uploads/2018/02/moni-argento.jpg' },
    { id: 'bananero', name: 'El Bananero', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/EL_BANANERO.jpg/960px-EL_BANANERO.jpg' },
    { id: 'caro', name: 'Caro Pardíaco', image: 'https://tn.com.ar/resizer/_MqJZrowfilzNy78PIfr2Bc559o=/arc-anglerfish-arc2-prod-artear/public/CBBHAC7UFRG5DO3WZOU5JS5KCY.png' },
    { id: 'atendedor', name: 'Atendedor Boludos', image: 'https://pbs.twimg.com/media/GHtcJ3hWIAAAgl1.jpg' },
    { id: 'maratea', name: 'Santi Maratea', image: 'https://media.a24.com/p/368ef9a27bc5b805dc7a27ff65002e57/adjuntos/296/imagenes/009/590/0009590769/1200x675/smart/santi-maratea.png' },
    { id: 'furia', name: 'Furia (GH)', image: 'https://statics.bigbangnews.com/2024/02/65bce86220641.png' },
    { id: 'alfa', name: 'Alfa (GH)', image: 'https://fotos.perfil.com/2024/04/05/trim/1140/641/alfa-en-gran-hermano-1780357.jpg' },
    { id: 'zulma', name: 'Zulma Lobato', image: 'https://lastfm.freetls.fastly.net/i/u/ar0/314f2f08f66444b99d4c0f338e6e5e2f.jpg' },
    { id: 'marley', name: 'Marley', image: 'https://media.a24.com/p/6528bee62e400224269303a12115cb89/adjuntos/296/imagenes/009/395/0009395103/1200x675/smart/marley.png' },
    { id: 'delmoro', name: 'Santiago del Moro', image: 'https://canalc.com.ar/wp-content/uploads/2023/12/tlf_mc_digital_carrousel_del-moro.jpeg' },
    { id: 'beto', name: 'Beto Casella', image: 'https://www.cronica.com.ar/img/2018/10/07/betocasella_crop1538921245746.jpg' },
    { id: 'pachano', name: 'Aníbal Pachano', image: 'https://imagenes.montevideo.com.uy/imgnoticias/201206/_W933_80/366445.jpg' },
    { id: 'polino', name: 'Marcelo Polino', image: 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2019/05/16202021/Marcelo-Polino1.jpg' },
    { id: 'carmen', name: 'Carmen Barbieri', image: 'https://fotos.perfil.com/2025/05/15/trim/950/534/carmen-barbieri-2023640.jpg' },
    { id: 'lizy', name: 'Lizy Tagliani', image: 'https://elintransigente.com/wp-content/uploads/2020/09/GWEEY3UPDZDVPO74VQ6PPTOU6M-1.jpg' },
    { id: 'charlotte', name: 'Charlotte Caniggia', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/artear/BFIDOBTD45AUJIX6LKV5FX5CWA.jpg' },
    { id: 'fantino', name: 'Alejandro Fantino', image: 'https://www.estacionsur.ar/wp-content/uploads/2023/05/fantino-unlp.jpeg' },
    { id: 'cris', name: 'Cris Morena', image: 'https://www.cmtv.com.ar/imagenes_artistas/2779.webp' },
    { id: 'maru', name: 'Maru Botana', image: 'https://fotos.perfil.com/2025/03/20/trim/950/534/maru-botana-1988414.jpg' }, // Foto chupando hielo si te animás
    { id: 'darin', name: 'Ricardo Darín', image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/XOKPGS3P6ZBJ7MPGXUKV63NBNA.jpg' },
    { id: 'olmedo', name: 'Alberto Olmedo', image: 'https://www.fundacionkonex.org/custom/web/data/imagenes/repositorio/2010/6/1/1822/201603161144521e913e1b06ead0b66e30b6867bf63549.jpg' },
    { id: 'porcel', name: 'Jorge Porcel', image: 'https://images.mubicdn.net/images/cast_member/32361/cache-275143-1509697459/image-w856.jpg' },
    { id: 'capusotto', name: 'Diego Capusotto', image: 'https://media.lacapital.com.ar/p/acf463ef4cf8a5b6223314513b39c79c/adjuntos/203/imagenes/007/416/0007416348/1200x675/smart/diego-capusotto-lanza-hoy-las-2230-la-television-publica-la-septima-temporada-exitosa-peter-capusotto-y-sus-videos.jpg' },
    { id: 'migue', name: 'Migue Granados', image: 'https://buenosairesherald.com/wp-content/uploads/2023/09/migue-granados-espn.jpg' },
    { id: 'yayo', name: 'Yayo', image: 'https://www.cronica.com.ar/img/2021/07/08/yayo_x1x.jpg' },
    { id: 'pinon', name: 'Piñón Fijo', image: 'https://imgplateanet.com.ar/imagenes/img/actores/1440x500/pi%C3%B1%C3%B3nfijo.jpg' },
    { id: 'bala', name: 'Carlitos Balá', image: 'https://chisme.com.ar/wp-content/uploads/2025/08/chisme.com_.ar-2-9.jpg' },
];

// Función utilitaria para obtener 24 personajes al azar
export function getRandomBoard() {
    // Copiamos el array para no mutar el original
    const shuffled = [...CHARACTERS].sort(() => 0.5 - Math.random());
    // Devolvemos los primeros 24
    return shuffled.slice(0, 24);
}