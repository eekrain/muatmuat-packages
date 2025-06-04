import { create } from "zustand";

// Cara make nya kaya gini
// const searchBarDefaultState = {
//   layout: "searchBar",
//   screen: null,
//   header: {
//     onClickBackButton: () => {},
//   },
// };

// const formDefaultState = {
//   layout: "form",
//   screen: null,
//   header: {
//     onClickBackButton: () => {},
//     title: {
//       label: "",
//       className: "",
//     },
//     withMenu: {
//       onClickInfo: () => {},
//       onClickMenu: () => {},
//     },
//   },
//   footer: {
//     button: [],
//   },
// };

const defaultScreenState = {
  layout: "default",
  screen: null,
  header: {
    onClickBackButton: () => alert("belum di implementasi"),
    onClickNotificationButton: () => alert("belum di implementasi"),
    onClickChatButton: () => alert("belum di implementasi"),
    onClickMenuButton: () => alert("belum di implementasi"),
  },
};

export const useResponsiveRouterStore = create((set, get) => ({
  screenStack: [defaultScreenState],
  replaceScreen: (screenState) =>
    set((state) => ({
      screenStack: [...state.screenStack.slice(0, -1), screenState],
    })),
  pushScreen: (screenState) =>
    set((state) => ({
      screenStack: [...state.screenStack, screenState],
    })),
  popScreen: () =>
    set((state) => ({
      screenStack:
        state.screenStack.length > 1
          ? state.screenStack.slice(0, -1)
          : state.screenStack,
    })),
  resetScreen: () =>
    set({
      screenStack: [defaultScreenState],
    }),

  searchValue: "",
  setSearchValue: (value) => set({ searchValue: value }),
}));

export const useResponsiveRouter = () => {
  // Router actions
  const pushScreen = useResponsiveRouterStore((state) => state.pushScreen);
  const popScreen = useResponsiveRouterStore((state) => state.popScreen);
  const replaceScreen = useResponsiveRouterStore(
    (state) => state.replaceScreen
  );
  const resetScreens = useResponsiveRouterStore((state) => state.resetScreens);
  const setSearchValue = useResponsiveRouterStore(
    (state) => state.setSearchValue
  );
  return {
    pushScreen,
    popScreen,
    replaceScreen,
    resetScreens,
    setSearchValue,
  };
};

export const ResponsiveRoute = ({ screen, index = false, element }) => {
  const screenStack = useResponsiveRouterStore((state) => state.screenStack);
  const currentScreen = screenStack[screenStack.length - 1];

  if (index && !currentScreen?.screen) return element;
  if (currentScreen.screen === screen) return element;

  return null;
};
