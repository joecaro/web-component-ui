type PersistedState = {
    stickyCtaDismissTime: {
        [key: string]: any;
    };
};

const INITIAL_PERSISTED_STATE = {
    stickyCtaDismissTime: {},
};

export function getPersistedState(
    initialState = INITIAL_PERSISTED_STATE
): PersistedState {
    const persistedState =
        typeof window !== "undefined" && localStorage["persist:bam"]
            ? JSON.parse(
                  JSON.parse(localStorage["persist:bam"])?.persistedState
              )
            : initialState;

    return persistedState;
}

export function handleUpdatePersistedState({
    key,
    subKey = "",
    value,
}: {
    key: string;
    subKey?: string;
    value: any;
}) {
    const persistedState = getPersistedState();

    const updatedState = subKey
        ? {
              ...persistedState,
              [key]: {
                  ...persistedState[key as keyof PersistedState],
                  [subKey]: value,
              },
          }
        : { ...persistedState, [key]: value };

    try {
        localStorage.setItem(
            "persist:bam",
            JSON.stringify({ persistedState: JSON.stringify(updatedState) })
        );
    } catch {
        // Eat error
    }
}
