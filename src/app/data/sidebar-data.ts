import { SidenavItem } from "../layout/sidenav/sidenav-item/sidenav-item.interface";

export const ROOT_LAYOUT_DATA: SidenavItem[] = [
  {
    name: "APPS",
    position: 5,
    type: "subheading",
    customClass: "first-subheading",
  },
  {
    name: "Dashboard",
    routeOrFunction: "/",
    position: 10,
    icon: "receipt_long",
    type: "item",
    pathMatchExact: true,
  },
   {
        name: "Casts",
        routeOrFunction: "/master/casts",
        position: 15,
        icon:"person",
        type: "item",
        permissionCode: "",
      },
  {
        name: "Music",
        routeOrFunction: "/master/music",
        position: 20,
        icon:"music_note",
        type: "item",
        permissionCode: "",
      },
      {
        name: "Music Video",
        routeOrFunction: "/master/music-video",
        position: 25,
        icon:"video_library",
        type: "item",
        permissionCode: "",
      },
        {
        name: "Gallery",
        routeOrFunction: "/master/gallery",
        position: 25,
        icon:"collections",
        type: "item",
        permissionCode: "",
      },
          {
        name: "Question",
        routeOrFunction: "/master/question",
        position: 30,
        icon:"question_mark",
        type: "item",
        permissionCode: "",
      },

];
