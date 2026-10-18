const path = require('path');
const fs = require('fs');

type VersionNumbers = [number, number, number];

type DevDependencyMinimumVersionCase = {
  packageName: string;
  minimumVersion: string;
};

type PackageManifest = {
  devDependencies: Record<string, unknown>;
};

type PackageLockfile = {
  packages: Record<string, { version: unknown }>;
};

const packageManifestFileName = 'package.json';
const packageLockfileFileName = 'package-lock.json';

const devDependencyMinimumVersionCases: DevDependencyMinimumVersionCase[] = [
  { packageName: '@babel/core', minimumVersion: '8.0.7' },
  { packageName: '@babel/eslint-parser', minimumVersion: '8.0.7' },
  { packageName: '@babel/preset-typescript', minimumVersion: '8.0.7' },
  { packageName: '@swc/core', minimumVersion: '1.16.18' },
  {
    packageName: 'conventional-changelog-conventionalcommits',
    minimumVersion: '10.4.1',
  },
  { packageName: 'prettier', minimumVersion: '3.9.10' },
];

const versionTextNormalize = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

const versionNumbersParse = (version: string): VersionNumbers | null => {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

const versionNumbersCompare = (
  left: VersionNumbers,
  right: VersionNumbers,
): number => {
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) {
      return left[index] - right[index];
    }
  }
  return 0;
};

const versionViolationDescribe = (
  packageName: string,
  fileName: string,
  foundVersion: string | null,
  minimumVersion: string,
): string | null => {
  if (foundVersion === null) {
    return `${packageName} has no version in ${fileName}; required minimum is ${minimumVersion}`;
  }
  const foundNumbers = versionNumbersParse(foundVersion);
  if (foundNumbers === null) {
    return `${packageName} in ${fileName} is ${foundVersion}, which is not an exact major.minor.patch version; required minimum is ${minimumVersion}`;
  }
  const minimumNumbers = versionNumbersParse(minimumVersion);
  if (minimumNumbers === null) {
    return `${packageName} required minimum ${minimumVersion} is not an exact major.minor.patch version`;
  }
  if (versionNumbersCompare(foundNumbers, minimumNumbers) < 0) {
    return `${packageName} in ${fileName} is ${foundVersion}; required minimum is ${minimumVersion}`;
  }
  return null;
};

describe('updated dev dependency minimum versions', () => {
  test('package.json declares and package-lock.json resolves at least the minimum version of each updated dev dependency', () => {
    const manifest: PackageManifest = JSON.parse(
      fs.readFileSync(path.join(__dirname, packageManifestFileName), 'utf8'),
    );
    const lockfile: PackageLockfile = JSON.parse(
      fs.readFileSync(path.join(__dirname, packageLockfileFileName), 'utf8'),
    );

    const violations: string[] = [];
    for (const {
      packageName,
      minimumVersion,
    } of devDependencyMinimumVersionCases) {
      const declaredVersion = versionTextNormalize(
        manifest.devDependencies?.[packageName],
      );
      const resolvedVersion = versionTextNormalize(
        lockfile.packages?.[`node_modules/${packageName}`]?.version,
      );
      const declaredViolation = versionViolationDescribe(
        packageName,
        packageManifestFileName,
        declaredVersion,
        minimumVersion,
      );
      const resolvedViolation = versionViolationDescribe(
        packageName,
        packageLockfileFileName,
        resolvedVersion,
        minimumVersion,
      );
      if (declaredViolation !== null) {
        violations.push(declaredViolation);
      }
      if (resolvedViolation !== null) {
        violations.push(resolvedViolation);
      }
    }

    expect(violations).toEqual([]);
  });
});
