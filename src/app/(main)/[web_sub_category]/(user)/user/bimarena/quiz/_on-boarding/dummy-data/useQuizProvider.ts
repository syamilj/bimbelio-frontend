import { useLeaderboard } from "./useLeaderboard"
import { useSubCategory } from "./useSubCategory"
import { useUserProgress } from "./useUserProgress"
import { useUserStatistic } from "./useUserStatistic"
import { useVolume } from "./useVolume"

export const useQuizProvider = () => {
    const useVolumeQ = useVolume();
    const useSubCategoryQ = useSubCategory();
    return {
        useVolume: useVolumeQ,
        useSubCategory: useSubCategoryQ,
        useUserStatistic,
        useLeaderboard,
        useUserProgress,
        isLocked: false,
    }
}