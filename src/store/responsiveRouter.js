import { create } from "zustand";

// Cara make nya kaya gini
// const searchBarDefaultState = {
//   screen: "searchBar",
//   header: {
//     onClickBackButton: () => {},
//     onSearchValueChange: () => {},
//   },
// };

// const formDefaultState = {
//   screen: "form",
//   header: {
//     onClickBackButton: () => {},
//     titleLabel: "",
//     className: "",
//   },
//   footer: {
//     button: [],
//   },
// };

const defaultScreenState = {
  screen: "default",
  header: {
    onClickBackButton: () => alert("belum di implementasi"),
    onClickNotificationButton: () => alert("belum di implementasi"),
    onClickChatButton: () => alert("belum di implementasi"),
    onClickMenuButton: () => alert("belum di implementasi"),
  },
};

export const useResponsiveRouter = create((set, get) => ({
  screenStack: [defaultScreenState],
  pushScreen: (screenState) =>
    set((state) => ({
      screenStack: [...state.screenStack, screenState],
    })),
  replaceScreen: (screenState) =>
    set((state) => ({
      screenStack: [...state.screenStack.slice(0, -1), screenState],
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
}));

export const useResponsiveRouterActions = () => {
  // Router actions
  const pushScreen = useResponsiveRouter((state) => state.pushScreen);
  const popScreen = useResponsiveRouter((state) => state.popScreen);
  const replaceScreen = useResponsiveRouter((state) => state.replaceScreen);
  const resetScreens = useResponsiveRouter((state) => state.resetScreens);
  return {
    pushScreen,
    popScreen,
    replaceScreen,
    resetScreens,
  };
};
