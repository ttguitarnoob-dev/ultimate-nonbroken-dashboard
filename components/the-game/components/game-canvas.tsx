"use client";

import { useEffect, useRef } from "react";
import kaplay from "kaplay";

type Direction = "up" | "down" | "left" | "right";

const idleFrames: Record<Direction, number> = {
  up: 0,
  down: 3,
  left: 5,
  right: 6,
};

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const k = kaplay({
      width: 1280,
      height: 720,
      scale: 1,
      stretch: false,
      letterbox: true,
      background: [0, 0, 0],
      global: false,
    
      root: containerRef.current,
    });

    // BACKGROUND SPRITE
    k.loadSprite(
      "background",
      "/Game/Scenes/opening-scene/scene-1.webp",
    );

    // PLAYER SPRITE
    k.loadSprite("player", "/Game/Sprites/Hero/spritesheet.png", {
      sliceX: 4,
      sliceY: 2,

      anims: {
        "run-up": {
          from: 0,
          to: 1,
          speed: 8,
          loop: true,
        },

        "run-down": {
          from: 3,
          to: 2,
          speed: 8,
          loop: true,
        },

        "run-left": {
          from: 5,
          to: 4,
          speed: 8,
          loop: true,
        },

        "run-right": {
          from: 6,
          to: 7,
          speed: 8,
          loop: true,
        },
      },
    });

    k.onLoad(() => {

      // BACKGROUND PLACEMENT
      k.add([

        k.sprite("background"),
    
        k.pos(0, 0),
    
      ]);

      // PLAYER CHARACTER PLACEMENT
      const player = k.add([
        k.sprite("player", {
          frame: idleFrames.down,
        }),

        k.pos(
          k.width() / 2,
          k.height() / 2,
        ),

        k.anchor("center"),

        k.scale(0.3),
      ]);

      const SPEED = 150;

      let facing: Direction = "down";
      let moving = false;

      k.onUpdate(() => {
        let dx = 0;
        let dy = 0;

        if (k.isKeyDown("left") || k.isKeyDown("a")) {
          dx -= 1;
          facing = "left";
        }

        if (k.isKeyDown("right") || k.isKeyDown("d")) {
          dx += 1;
          facing = "right";
        }

        if (k.isKeyDown("up") || k.isKeyDown("w")) {
          dy -= 1;
          facing = "up";
        }

        if (k.isKeyDown("down") || k.isKeyDown("s")) {
          dy += 1;
          facing = "down";
        }

        const isMoving = dx !== 0 || dy !== 0;

        if (dx !== 0 && dy !== 0) {
          const length = Math.sqrt(
            dx * dx + dy * dy,
          );

          dx /= length;
          dy /= length;
        }

        if (isMoving) {
          player.move(
            dx * SPEED,
            dy * SPEED,
          );
        
          // Keep player inside the 1280x720 game area.
          const halfWidth = 16;
          const halfHeight = 16;
        
          player.pos.x = Math.max(
            halfWidth,
            Math.min(k.width() - halfWidth, player.pos.x),
          );
        
          player.pos.y = Math.max(
            halfHeight,
            Math.min(k.height() - halfHeight, player.pos.y),
          );
        
          const animation = `run-${facing}`;
        
          if (
            !moving ||
            player.curAnim() !== animation
          ) {
            player.play(animation);
          }
        } else if (moving) {
          player.stop();
          player.frame = idleFrames[facing];
        }

        moving = isMoving;
      });
    });

    return () => {
      k.quit();
    };
  }, []);

  return (
    <div className="rounded-2xl border-4 border-white/20 overflow-hidden shadow-2xl">
      <div
        ref={containerRef}
        className="w-[1280px] h-[720px]"
      />
    </div>
  );
}