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
    });

    /*
     * Actual sprite sheet layout:
     *
     *  0       1       2       3
     *  UP 1    UP 2    DOWN 2   DOWN 1
     *
     *  4       5       6       7
     *  LEFT 2  LEFT 1  RIGHT 1  RIGHT 2
     *
     * Idle frames:
     *   up    = 0
     *   down  = 3
     *   left  = 5
     *   right = 6
     */

    k.loadSprite("player", "/Game/Sprites/Hero/spritesheet.png", {
      sliceX: 4,
      sliceY: 2,

      anims: {
        "run-up": {
          from: 0,
          to: 1,
          speed: 6,
          loop: true,
        },

        "run-down": {
          from: 3,
          to: 2,
          speed: 6,
          loop: true,
        },

        "run-left": {
          from: 5,
          to: 4,
          speed: 6,
          loop: true,
        },

        "run-right": {
          from: 6,
          to: 7,
          speed: 6,
          loop: true,
        },
      },
    });

    k.onLoad(() => {
      const player = k.add([
        k.sprite("player", {
          frame: idleFrames.down,
        }),

        k.pos(
          k.width() / 2,
          k.height() / 2,
        ),

        k.anchor("center"),
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

        // Normalize diagonal movement
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

          const animation = `run-${facing}`;

          // Only restart the animation when movement
          // begins or the direction changes.
          if (
            !moving ||
            player.curAnim() !== animation
          ) {
            player.play(animation);
          }
        } else if (moving) {
          // Return to the correct idle frame.
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
    <div
      ref={containerRef}
      className="w-[1280px] h-[720px] overflow-hidden"
    />
  );
}