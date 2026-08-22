import { ScenePlayer, Stage, type ScenePhase } from "chronoglyph";
import { BUILT_IN_EXAMPLES, DataDrivenScene } from "chronoglyph/data";
import { WaterCycleDemo } from "chronoglyph/scenes";
import "chronoglyph/styles.css";
import "chronoglyph/scenes.css";

const phases = [
  { id: "ready", label: "READY", startMs: 0, snapshotMs: 100 },
] as const satisfies readonly ScenePhase[];

export function Smoke() {
  return (
    <>
      <ScenePlayer phases={phases} durationMs={500} autoplay={false}>
        {() => <Stage width={100} height={100} label="Smoke" />}
      </ScenePlayer>
      <DataDrivenScene scene={BUILT_IN_EXAMPLES[0].scene} />
      <WaterCycleDemo />
    </>
  );
}
