import type { Song } from "../interfaces/sound";

import seccion1_error0 from "@/assets/sounds/seccion1_error0.mp3";
import seccion1_error1 from "@/assets/sounds/seccion1_error1.mp3";
import seccion1_error2 from "@/assets/sounds/seccion1_error2.mp3";
import seccion2_error0 from "@/assets/sounds/seccion2_error0.mp3";
import seccion2_error1 from "@/assets/sounds/seccion2_error1.mp3";
import seccion2_error2 from "@/assets/sounds/seccion2_error2.mp3";
import seccion3_error0 from "@/assets/sounds/seccion3_error0.mp3";
import seccion3_error1 from "@/assets/sounds/seccion3_error1.mp3";
import seccion3_error2 from "@/assets/sounds/seccion3_error2.mp3";
import seccion3_error3 from "@/assets/sounds/seccion3_error3.mp3";
import seccion3_error4 from "@/assets/sounds/seccion3_error4.mp3";
import seccion4_error0 from "@/assets/sounds/seccion4_error0.mp3";
import seccion4_error1 from "@/assets/sounds/seccion4_error1.mp3";
import seccion4_error2 from "@/assets/sounds/seccion4_error2.mp3";
import seccion4_error3 from "@/assets/sounds/seccion4_error3.mp3";
import seccion4_error4 from "@/assets/sounds/seccion4_error4.mp3";

export const SONGS: Song[] = [
  {
    id: "song01",
    title: "Canción 1",
    sections: [
      {
        id: "seccion1",
        variants: {
           0: { module: seccion1_error0 as unknown as number,
              duration: 50,
            },
           1: { module: seccion1_error1 as unknown as number,
              duration: 50,
            },
           2: { module: seccion1_error2 as unknown as number,
              duration: 50,
            },
          3: { module: seccion1_error2 as unknown as number,
              duration: 21,
           },
          4: { module: seccion1_error2 as unknown as number,
              duration: 21,
           },
        },
      },
      {
        id: "seccion2",
        variants: {
           0: { module: seccion2_error0 as unknown as number,
              duration: 27,
            },
           1: { module: seccion2_error1 as unknown as number,
              duration: 27,
            },
           2: { module: seccion2_error2 as unknown as number,
              duration: 27,
            },
          3: { module: seccion2_error2 as unknown as number,
              duration: 24,
           },
          4: { module: seccion2_error2 as unknown as number,
              duration: 24,
           },
        },
      },
      {
        id: "seccion3",
        variants: {
           0: { module: seccion3_error0 as unknown as number,
              duration: 35,
            },
           1: { module: seccion3_error1 as unknown as number,
              duration: 35,
            },
           2: { module: seccion3_error2 as unknown as number,
              duration: 35,
            },
           3: { module: seccion3_error3 as unknown as number,
              duration: 35,
            },
           4: { module: seccion3_error4 as unknown as number,
              duration: 35,
            },
        },
      },
      {
        id: "seccion4",
        variants: {
           0: { module: seccion4_error0 as unknown as number,
              duration: 31,
            },
           1: { module: seccion4_error1 as unknown as number,
              duration: 31,
            },
           2: { module: seccion4_error2 as unknown as number,
              duration: 31,
            },
           3: { module: seccion4_error3 as unknown as number,
              duration: 31,
            },
           4: { module: seccion4_error4 as unknown as number,
              duration: 31,
            },
        },
      },
    ],
  },
];
