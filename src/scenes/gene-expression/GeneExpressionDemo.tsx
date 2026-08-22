import { ScenePlayer } from "../../components/ScenePlayer";
import { useMediaQuery } from "../../core/useMediaQuery";
import { GeneExpressionStage } from "./GeneExpressionStage";
import { GENE_EXPRESSION_LAYOUT_COMPACT, GENE_EXPRESSION_LAYOUT_WIDE } from "./layout";
import { GENE_EXPRESSION_DURATION_MS, GENE_EXPRESSION_PHASES } from "./model";

export function GeneExpressionDemo() {
  const compact = useMediaQuery("(max-width: 760px)");
  const layout = compact ? GENE_EXPRESSION_LAYOUT_COMPACT : GENE_EXPRESSION_LAYOUT_WIDE;

  return (
    <ScenePlayer
      phases={GENE_EXPRESSION_PHASES}
      durationMs={GENE_EXPRESSION_DURATION_MS}
      className="cg-playground-player cg-authored-scene-player cg-gene-expression-player"
    >
      {(context) => <GeneExpressionStage context={context} layout={layout} />}
    </ScenePlayer>
  );
}
