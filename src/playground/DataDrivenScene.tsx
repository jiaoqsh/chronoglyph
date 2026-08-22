import { useMemo } from "react";
import { anchor, box } from "../core/geometry";
import { isWithinWindow, windowProgress } from "../core/time";
import type { Box, SceneRenderContext } from "../core/types";
import { ScenePlayer } from "../components/ScenePlayer";
import { DataStream } from "../primitives/DataStream";
import { Edge } from "../primitives/Edge";
import { Packet } from "../primitives/Packet";
import { SceneNode } from "../primitives/SceneNode";
import { Stage } from "../primitives/Stage";
import type {
  SceneDefinition,
  SceneEdgeDefinition,
  SceneNodeDefinition,
  SceneTransferDefinition,
} from "./schema";
import { parseSceneDefinition } from "./schema";

function nodeBox(node: SceneNodeDefinition): Box {
  return box(node.x, node.y, node.width, node.height);
}

function isActiveInPhase(activePhases: readonly string[] | undefined, phaseId: string): boolean {
  return activePhases?.includes(phaseId) ?? false;
}

function edgePoints(
  definition: SceneEdgeDefinition | SceneTransferDefinition,
  nodes: ReadonlyMap<string, SceneNodeDefinition>,
) {
  const fromNode = nodes.get(definition.from)!;
  const toNode = nodes.get(definition.to)!;
  let from = anchor(nodeBox(fromNode), definition.fromAnchor ?? "right");
  let to = anchor(nodeBox(toNode), definition.toAnchor ?? "left");
  if ("reverse" in definition && definition.reverse) {
    [from, to] = [to, from];
  }
  return { from, to };
}

interface SceneCanvasProps {
  scene: SceneDefinition;
  context: SceneRenderContext<string>;
}

function SceneCanvas({ scene, context }: SceneCanvasProps) {
  const nodeMap = new Map(scene.nodes.map((node) => [node.id, node]));
  const phaseId = context.phase.id;

  return (
    <Stage width={scene.width} height={scene.height} label={scene.title}>
      <g className="cg-stage-grid" aria-hidden="true">
        {Array.from({ length: Math.ceil(scene.width / 80) + 1 }, (_, index) => (
          <line key={index} x1={index * 80} y1="0" x2={index * 80} y2={scene.height} />
        ))}
      </g>

      {scene.edges.map((edge) => (
        <Edge
          key={edge.id}
          {...edgePoints(edge, nodeMap)}
          curvature={edge.curvature ?? 0}
          tone={edge.tone ?? "neutral"}
          active={isActiveInPhase(edge.activePhases, phaseId)}
          dashed={edge.dashed ?? true}
        />
      ))}

      {scene.nodes.map((node) => {
        const state = node.states?.[phaseId];
        return (
          <SceneNode
            key={node.id}
            box={nodeBox(node)}
            title={node.title}
            subtitle={state?.subtitle ?? node.subtitle ?? ""}
            eyebrow={node.eyebrow ?? ""}
            tone={state?.tone ?? node.tone ?? "neutral"}
            active={isActiveInPhase(node.activePhases, phaseId) || state !== undefined}
          />
        );
      })}

      {scene.transfers.map((transfer) => {
        const points = edgePoints(transfer, nodeMap);
        const visible = isWithinWindow(context.elapsedMs, transfer.startMs, transfer.endMs);
        const progress = windowProgress(context.elapsedMs, transfer.startMs, transfer.endMs);

        return transfer.kind === "stream" ? (
          <DataStream
            key={transfer.id}
            {...points}
            progress={progress}
            active={visible}
            curvature={transfer.curvature ?? 0}
            tone={transfer.tone ?? "data"}
          />
        ) : (
          <Packet
            key={transfer.id}
            {...points}
            progress={progress}
            visible={visible}
            curvature={transfer.curvature ?? 0}
            tone={transfer.tone ?? "accent"}
            label={transfer.label ?? "DATA"}
            width={Math.max(62, (transfer.label?.length ?? 4) * 8 + 24)}
          />
        );
      })}

      <g className="cg-playground-stage-caption" transform="translate(20 25)">
        <text>{scene.id.toUpperCase()}</text>
        <text x={scene.width - 40} textAnchor="end">
          {context.phase.label} / T+{Math.round(context.elapsedMs)}MS
        </text>
      </g>
    </Stage>
  );
}

export interface DataDrivenSceneProps {
  scene: SceneDefinition;
  revision?: number;
}

export function DataDrivenScene({ scene, revision = 0 }: DataDrivenSceneProps) {
  const validatedScene = useMemo(() => parseSceneDefinition(scene), [scene]);

  return (
    <ScenePlayer
      key={`${validatedScene.id}-${revision}`}
      phases={validatedScene.phases}
      durationMs={validatedScene.durationMs}
      className="cg-playground-player"
    >
      {(context) => <SceneCanvas scene={validatedScene} context={context} />}
    </ScenePlayer>
  );
}
