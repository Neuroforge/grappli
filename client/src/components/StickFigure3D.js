import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

// Joint indices from GrappleMap
const JOINT_INDICES = {
  LeftToe: 0,
  RightToe: 1,
  LeftHeel: 2,
  RightHeel: 3,
  LeftAnkle: 4,
  RightAnkle: 5,
  LeftKnee: 6,
  RightKnee: 7,
  LeftHip: 8,
  RightHip: 9,
  LeftShoulder: 10,
  RightShoulder: 11,
  LeftElbow: 12,
  RightElbow: 13,
  LeftWrist: 14,
  RightWrist: 15,
  LeftHand: 16,
  RightHand: 17,
  LeftFingers: 18,
  RightFingers: 19,
  Core: 20,
  Neck: 21,
  Head: 22,
};

// Segment definitions (from GrappleMap)
const SEGMENTS = [
  [[0, 2], 0.23, 0.025, true], // LeftToe to LeftHeel
  [[0, 4], 0.18, 0.025, true], // LeftToe to LeftAnkle
  [[2, 4], 0.09, 0.025, true], // LeftHeel to LeftAnkle
  [[4, 6], 0.43, 0.055, true], // LeftAnkle to LeftKnee
  [[6, 8], 0.43, 0.085, true], // LeftKnee to LeftHip
  [[8, 20], 0.27, 0.1, true], // LeftHip to Core
  [[20, 10], 0.37, 0.075, true], // Core to LeftShoulder
  [[10, 12], 0.29, 0.06, true], // LeftShoulder to LeftElbow
  [[12, 14], 0.26, 0.03, true], // LeftElbow to LeftWrist
  [[14, 16], 0.08, 0.02, true], // LeftWrist to LeftHand
  [[16, 18], 0.08, 0.02, true], // LeftHand to LeftFingers
  [[14, 18], 0.14, 0.02, false], // LeftWrist to LeftFingers
  [[1, 3], 0.23, 0.025, true], // RightToe to RightHeel
  [[1, 5], 0.18, 0.025, true], // RightToe to RightAnkle
  [[3, 5], 0.09, 0.025, true], // RightHeel to RightAnkle
  [[5, 7], 0.43, 0.055, true], // RightAnkle to RightKnee
  [[7, 9], 0.43, 0.085, true], // RightKnee to RightHip
  [[9, 20], 0.27, 0.1, true], // RightHip to Core
  [[20, 11], 0.37, 0.075, true], // Core to RightShoulder
  [[11, 13], 0.29, 0.06, true], // RightShoulder to RightElbow
  [[13, 15], 0.27, 0.03, true], // RightElbow to RightWrist
  [[15, 17], 0.08, 0.02, true], // RightWrist to RightHand
  [[17, 19], 0.08, 0.02, true], // RightHand to RightFingers
  [[15, 19], 0.14, 0.02, false], // RightWrist to RightFingers
  [[8, 9], 0.23, 0.1, false], // LeftHip to RightHip
  [[10, 21], 0.175, 0.065, true], // LeftShoulder to Neck
  [[11, 21], 0.175, 0.065, true], // RightShoulder to Neck
  [[21, 22], 0.165, 0.05, true], // Neck to Head
];

const StickFigure3D = ({
  position,
  transition,
  isAnimating = false,
  onAnimationComplete,
  className = 'h-96 w-full',
}) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const stickFigureRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Babylon.js
    engineRef.current = new BABYLON.Engine(canvasRef.current, true);
    sceneRef.current = new BABYLON.Scene(engineRef.current);

    // Create camera
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      0,
      Math.PI / 3,
      10,
      BABYLON.Vector3.Zero(),
      sceneRef.current
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 20;

    // Create lighting
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      sceneRef.current
    );
    light.intensity = 0.7;

    const directionalLight = new BABYLON.DirectionalLight(
      'directionalLight',
      new BABYLON.Vector3(0, -1, 0),
      sceneRef.current
    );
    directionalLight.intensity = 0.5;

    // Create ground for reference
    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 10, height: 10 },
      sceneRef.current
    );
    const groundMaterial = new BABYLON.StandardMaterial(
      'groundMat',
      sceneRef.current
    );
    groundMaterial.alpha = 0.3;
    ground.material = groundMaterial;

    // Render stick figure
    if (position) {
      renderStickFigure(position.coordinates);
    }

    // Start render loop
    sceneRef.current.render();

    const resizeHandler = () => {
      engineRef.current.resize();
    };
    window.addEventListener('resize', resizeHandler);

    setIsLoading(false);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (engineRef.current) {
        engineRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    if (position) {
      renderStickFigure(position.coordinates);
    }
  }, [position]);

  useEffect(() => {
    if (!sceneRef.current || !transition || !isAnimating) return;

    animateTransition(transition.frames);
  }, [transition, isAnimating]);

  const renderStickFigure = coordinates => {
    if (!sceneRef.current) return;

    // Remove existing stick figure
    if (stickFigureRef.current) {
      stickFigureRef.current.dispose();
    }

    // Create stick figure group
    stickFigureRef.current = new BABYLON.TransformNode(
      'stickFigure',
      sceneRef.current
    );

    // Create joints
    const joints = coordinates.map((coord, index) => {
      const joint = BABYLON.MeshBuilder.CreateSphere(
        `joint_${index}`,
        { diameter: 0.1 },
        sceneRef.current
      );
      joint.position = new BABYLON.Vector3(coord[0], coord[1], coord[2]);
      joint.parent = stickFigureRef.current;

      const material = new BABYLON.StandardMaterial(
        `jointMat_${index}`,
        sceneRef.current
      );
      material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
      joint.material = material;

      return joint;
    });

    // Create segments (bones)
    SEGMENTS.forEach((segment, index) => {
      const [jointIndices, length, radius, visible] = segment;
      const [joint1Index, joint2Index] = jointIndices;

      if (!visible) return;

      const joint1 = joints[joint1Index];
      const joint2 = joints[joint2Index];

      if (!joint1 || !joint2) return;

      const direction = joint2.position.subtract(joint1.position);
      const distance = direction.length();

      if (distance === 0) return;

      const cylinder = BABYLON.MeshBuilder.CreateCylinder(
        `segment_${index}`,
        {
          height: distance,
          diameterTop: radius * 2,
          diameterBottom: radius * 2,
        },
        sceneRef.current
      );

      // Position and orient the cylinder
      const midPoint = joint1.position.add(joint2.position).scale(0.5);
      cylinder.position = midPoint;

      // Orient cylinder to point from joint1 to joint2
      const up = new BABYLON.Vector3(0, 1, 0);
      const axis = BABYLON.Vector3.Cross(up, direction.normalize());
      const angle = Math.acos(BABYLON.Vector3.Dot(up, direction.normalize()));

      if (axis.length() > 0) {
        cylinder.rotate(axis, angle);
      }

      cylinder.parent = stickFigureRef.current;

      const material = new BABYLON.StandardMaterial(
        `segmentMat_${index}`,
        sceneRef.current
      );
      material.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
      cylinder.material = material;
    });
  };

  const animateTransition = frames => {
    if (!sceneRef.current || !frames || frames.length === 0) return;

    let currentFrame = 0;
    const totalFrames = frames.length;
    const frameDuration = 100; // milliseconds per frame

    const animate = () => {
      if (currentFrame >= totalFrames) {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        return;
      }

      renderStickFigure(frames[currentFrame]);
      currentFrame++;

      setTimeout(animate, frameDuration);
    };

    animate();
  };

  return (
    <div className={className}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

export default StickFigure3D;
