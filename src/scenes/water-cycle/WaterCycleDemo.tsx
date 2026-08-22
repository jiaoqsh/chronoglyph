import { ScenePlayer } from "../../components/ScenePlayer";
import { useMediaQuery } from "../../core/useMediaQuery";
import { WATER_CYCLE_LAYOUT_COMPACT, WATER_CYCLE_LAYOUT_WIDE } from "./layout";
import { WATER_CYCLE_DURATION_MS, WATER_CYCLE_PHASES } from "./model";
import { WaterCycleStage } from "./WaterCycleStage";

export function WaterCycleDemo() {
  const compact = useMediaQuery("(max-width: 760px)");
  const layout = compact ? WATER_CYCLE_LAYOUT_COMPACT : WATER_CYCLE_LAYOUT_WIDE;

  return (
    <ScenePlayer
      phases={WATER_CYCLE_PHASES}
      durationMs={WATER_CYCLE_DURATION_MS}
      className="cg-playground-player cg-authored-scene-player cg-water-cycle-player"
    >
      {(context) => <WaterCycleStage context={context} layout={layout} compact={compact} />}
    </ScenePlayer>
  );
}
