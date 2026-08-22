import { GeneExpressionDemo } from "../scenes/gene-expression/GeneExpressionDemo";
import { WaterCycleDemo } from "../scenes/water-cycle/WaterCycleDemo";
import type { AuthoredSceneId } from "./catalog";

export interface AuthoredScenePreviewProps {
  sceneId: AuthoredSceneId;
}

export function AuthoredScenePreview({ sceneId }: AuthoredScenePreviewProps) {
  switch (sceneId) {
    case "water-cycle":
      return <WaterCycleDemo />;
    case "dna-to-protein":
      return <GeneExpressionDemo />;
  }
}
