v?=
version?=$(v)
version_temp=
version_value_temp=



old_version_package = $(shell jq -r '.version' package.json)
old_version_package_line = $(shell awk '/"version":/{ print NR; exit;}' package.json | head -1)

old_version_package_first_line = $(shell awk '/"version":/{ print NR; }' package-lock.json | head -2 | awk 'NR==1')
old_version_package_first_lock = $(shell jq -r '.version' package-lock.json)

old_version_package_second_line = $(shell awk '/"version":/{ print NR; }' package-lock.json | head -2 | awk 'NR==2')
old_version_package_second_lock = $(shell jq -r '.packages."".version' package-lock.json)

.SILENT:

define help_func
	echo "make args table"
	echo ""
	echo "  version"
	echo "    v => define version manually (respecting X.X.X synthax)"
	echo "  patch"
	echo "    pt => patch"
	echo "    └ pta => patch add"
	echo "      └ ptc => patch commit"
	echo "        └ ptp => patch push"
	echo "  minor"
	echo "    mn => minor"
	echo "    └ mna => minor add"
	echo "      └ mnc => minor commit"
	echo "        └ mnp => minor push"
	echo "  major"
	echo "    mj => major"
	echo "    └ mja => major add"
	echo "      └ mjc => major commit"
	echo "        └ mjp => major push"
endef

define local_part_func
	echo "+------------------------------------------------------------+"
	echo "|                         LOCAL PART                         |"
	echo "+------------------------------------------------------------+"
	echo ""
endef

define detect_version_func
	echo "new version selected: $(version)"
	echo ""
endef

define modify_version_package_func
	echo "Change version in package.json:"

	echo '   l.$(old_version_package_line) | "version": "$(old_version_package)" -> "$(version)"'
	jq '.version = "$(version)"' package.json | sponge package.json

	echo ""

	echo "Change version in package-lock.json:"

	echo '   l.$(old_version_package_first_line) | "version": "$(old_version_package_first_lock)" -> "$(version)"'
	jq '.version = "$(version)"' package-lock.json | sponge package-lock.json

	echo '   l.$(old_version_package_second_line) | "version": "$(old_version_package_second_lock)" -> "$(version)"'
	jq '.packages."".version= "$(version)"' package-lock.json | sponge package-lock.json

	echo ""

	echo "Resume:"
	echo "   old version: $(old_version_package)"
	echo "   new version: $(version)"

	echo ""
endef

define default_local_func
	@$(call local_part_func)
	@$(call detect_version_func)
	@$(call modify_version_package_func)
endef

define git_part_func
	echo "+------------------------------------------------------------+"
	echo "|                          GIT PART                          |"
	echo "+------------------------------------------------------------+"
	echo ""
endef

define git_add_func
	echo "Working Tree"
	echo "   Add field to working tree..."
	git add package*.json
endef

define git_commit_func
	echo "Commit"
	echo "   Create commit message file text..."
	touch "commit_version_$(version).txt"

	echo "[version] bump to v$(version)" >> "commit_version_$(version).txt"
	echo "modified version in package" >> "commit_version_$(version).txt"
	echo "" >> "commit_version_$(version).txt"
	echo "" >> "commit_version_$(version).txt"
	echo "From:   v$(old_version_package)" >> "commit_version_$(version).txt"
	echo "To:        v$(version)" >> "commit_version_$(version).txt"

	echo "   Configure commit message..."
	git commit -F "commit_version_$(version).txt" --quiet

	echo "   Delete commit message file text..."
	rm "commit_version_$(version).txt"
endef

define git_push_func
	echo "Push"
	echo "   Push commit..."
	git push --quiet
endef

define def_version_func
	$(eval version := $(old_version_package))
endef

define major_version_func
	$(eval version_value_temp := $(shell echo $(version) | tr '.' '\n' | awk 'NR==1'))
	$(eval version_temp := $(version_temp)$(shell echo "$(version_value_temp) + 1" | bc).0.0)
	$(eval version := $(version_temp))
endef

define minor_version_func
	$(eval version_value_temp := $(shell echo $(version) | tr '.' '\n' | awk 'NR==2'))
	$(eval version_temp := $(version_temp)$(shell echo $(version) | tr '.' '\n' | awk 'NR==1').)
	$(eval version_temp := $(version_temp)$(shell echo "$(version_value_temp) + 1" | bc).0)
	$(eval version := $(version_temp))
endef

define patch_version_func
	$(eval version_value_temp := $(shell echo $(version) | tr '.' '\n' | awk 'NR==3'))
	$(eval version_temp := $(version_temp)$(shell echo $(version) | tr '.' '\n' | awk 'NR==1').)
	$(eval version_temp := $(version_temp)$(shell echo $(version) | tr '.' '\n' | awk 'NR==2').)
	$(eval version_temp := $(version_temp)$(shell echo "$(version_value_temp) + 1" | bc))
	$(eval version := $(version_temp))
endef

define patch_func
	@$(call def_version_func)
	@$(call patch_version_func)
endef

define patch_add_func
	@$(call patch_func)

	@$(call default_local_func)

	@$(call git_part_func)
	@$(call git_add_func)
endef

define minor_func
	@$(call def_version_func)
	@$(call minor_version_func)
endef

define minor_add_func
	@$(call minor_func)

	@$(call default_local_func)

	@$(call git_part_func)
	@$(call git_add_func)
endef

define major_func
	@$(call def_version_func)
	@$(call major_version_func)
endef

define major_add_func
	@$(call major_func)

	@$(call default_local_func)

	@$(call git_part_func)
	@$(call git_add_func)
endef

version:
ifneq ($(strip $(version)),)

	@$(call default_local_func)

	@$(call git_part_func)
	@$(call git_add_func)
	@$(call git_commit_func)
	@$(call git_push_func)

endif
ifeq ($(strip $(version)),)
	@$(call help_func)
endif

patch pt:
	@$(call patch_func)

pta pa:
	@$(call patch_add_func)

ptc pc:
	@$(call patch_add_func)
	@$(call git_commit_func)

ptp pp:
	@$(call patch_add_func)
	@$(call git_commit_func)
	@$(call git_push_func)

minor mn:
	@$(call minor_func)

mna:
	@$(call minor_add_func)

mnc:
	@$(call minor_add_func)
	@$(call git_commit_func)

mnp:
	@$(call minor_add_func)
	@$(call git_commit_func)
	@$(call git_push_func)

major mj:
	@$(call major_func)

mja:
	@$(call major_add_func)

mjc:
	@$(call major_add_func)
	@$(call git_commit_func)

mjp:
	@$(call major_add_func)
	@$(call git_commit_func)
	@$(call git_push_func)

help:
	@$(call help_func)