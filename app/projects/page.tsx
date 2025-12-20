"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconStar, IconGitFork, IconBrandGithub } from "@tabler/icons-react";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export default function ProjectsPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/users/dbqz/repos?sort=updated&per_page=100", {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          console.error("API response is not an array:", data);
          setRepos([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching repos:", error);
        setRepos([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <IconBrandGithub className="w-8 h-8 md:w-10 md:h-10 text-white" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              我的项目
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            来自 GitHub 的开源项目
          </p>
        </motion.div>
        
        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : repos.length === 0 ? (
          <div className="text-center text-gray-400">暂无项目数据</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-neutral-900 rounded-lg p-6 hover:bg-neutral-800 transition-all hover:scale-105"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors flex-1">
                    {repo.name}
                  </h3>
                  <IconBrandGithub className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {repo.description || "暂无描述"}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <IconStar className="w-4 h-4" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconGitFork className="w-4 h-4" />
                    {repo.forks_count}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
