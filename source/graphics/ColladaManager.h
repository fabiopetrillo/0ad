#ifndef INCLUDED_COLLADAMANAGER
#define INCLUDED_COLLADAMANAGER

#include "lib/file/vfs/vfs_path.h"

class CStr8;
class CColladaManagerImpl;

class CColladaManager
{
public:
	enum FileType { PMD, PSA };

	CColladaManager();
	~CColladaManager();

	/**
	 * Returns the VFS path to a PMD/PSA file for the given source file.
	 * Performs a (cached) conversion from COLLADA if necessary.
	 *
	 * @param sourceName path and name, minus extension, of file to load.
	 * One of either "sourceName.pmd" or "sourceName.dae" should exist.
	 *
	 * @return full VFS path (including extension) of file to load; or empty
	 * string if there was a problem and it could not be loaded.
	 */
	VfsPath GetLoadableFilename(const CStr8& sourceName, FileType type);

private:
	CColladaManagerImpl* m;
};

#endif // INCLUDED_COLLADAMANAGER
