class ClaudeReskin < Formula
  desc "Claude Code skill for system reskinning and refactoring"
  homepage "https://github.com/tc6-01/claude-reskin"
  url "https://github.com/tc6-01/claude-reskin/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "" # Will be filled after first release
  license "MIT"

  def install
    target = "#{Dir.home}/.claude/skills/reskin"
    mkdir_p target
    cp "SKILL.md", target
    cp_r "templates", target
    ohai "claude-reskin skill installed to #{target}"
    ohai "Use /reskin in Claude Code to activate."
  end

  test do
    assert_path_exists "#{Dir.home}/.claude/skills/reskin/SKILL.md"
  end
end
