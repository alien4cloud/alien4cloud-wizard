export interface AbstractArtifact {
  artifactType: string;
  /** Specifies the reference of the artifact. */
  artifactRef: string;
  /**
   * Non TOSCA compliant property, the artifactRepository indicate where the artifact is stored. It might be in the archive it-self (in this case this
   * property is null), in alien's internal artifact repository (alien) or nexus, git, svn ...
   */
  artifactRepository: string;
  /** The name of the archive in which the original artifact lies. */
  archiveName: string;
  /** The version of the archive in which the original artifact lies. */
  archiveVersion: string;
  /** Repository url in case the artifact has to be downloaded from a repository. */
  repositoryURL: string;
  /** The credentials to access the repository. */
  repositoryCredential: Map<string, any>;
  /** The name (id) of the repository to reference. */
  repositoryName: string;
  /**
   * The local path to retrieve the artifact. Attention this is normally set before deployment so that the plugin knows where to get artifact.
   */
  artifactPath: string;
}

export interface DeploymentArtifact extends AbstractArtifact {
  /** Specifies the display name of the artifact. */
  artifactName: string;
  /** The path where the artifact must be copied to the target host. */
  deployPath: string;
  description: string;
}
