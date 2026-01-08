export function generateMockChatResponse(query, relevantChunks) {
    const responses = [
      `Based on the PDF content, I can help you with that. The document discusses ${query.toLowerCase()} in detail, particularly in sections covering implementation strategies and best practices.`,
      
      `I've found several relevant sections in the PDF that relate to your query about "${query}". Here's what I discovered:\n\n• Key insight from the main content\n• Important detail from supporting sections\n• Additional context from the analysis\n\nWould you like me to elaborate on any of these points?`,
      
      `Great question! After reviewing the PDF, I can provide you with the following information:\n\nThe document addresses this topic comprehensively, with detailed explanations of the key concepts and their practical applications.`,
      
      `I've analyzed the PDF content related to your question. Here are the main findings:\n\n1. Primary consideration: The core concept is well-explained\n2. Secondary factor: Supporting details are provided\n3. Additional context: Related information is available\n\nThis information is primarily found in the main sections of the document.`
    ];
    
    const contextSnippet = relevantChunks.length > 0 
      ? `\n\n**Context from document:**\n"${relevantChunks[0].content.substring(0, 150)}..."` 
      : '';
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    return baseResponse + contextSnippet;
  }
  
  /**
   * Mock AI responses for summaries
   */
  export function generateMockSummary(type, extractedText) {
    const summaries = {
      brief: `This document provides a comprehensive overview of its subject matter. It outlines key challenges, proposed solutions, and expected outcomes. The content is structured to present strategic insights and actionable recommendations with supporting data and analysis.`,
      
      detailed: `**Executive Summary**\nThis comprehensive document presents a detailed analysis of the subject matter, addressing current challenges and proposing strategic solutions.\n\n**Key Sections**\nThe document is organized into multiple sections covering problem analysis, proposed solutions, implementation strategies, and expected outcomes.\n\n**Main Findings**\nThe analysis reveals several critical insights that inform the recommended approach. Supporting data and case studies validate the proposed methodology.\n\n**Recommendations**\nThe document concludes with actionable recommendations designed to achieve the stated objectives while mitigating identified risks.`,
      
      'key-points': `**Main Topics:**\n• Comprehensive analysis of current situation\n• Detailed proposal with strategic solutions\n• Implementation timeline and methodology\n• Expected outcomes and success metrics\n\n**Critical Insights:**\n• Problem identification and root cause analysis\n• Strategic approach to address challenges\n• Resource requirements and allocation\n• Risk assessment and mitigation strategies\n\n**Action Items:**\n• Review proposed recommendations\n• Evaluate implementation feasibility\n• Assess resource requirements\n• Develop detailed action plan`,
      
      executive: `**Strategic Overview**\nThis document presents a strategic initiative designed to address identified challenges through innovative solutions.\n\n**Business Case**\nThe analysis demonstrates clear value proposition with measurable outcomes and return on investment.\n\n**Key Recommendations**\n• Implement proposed solution framework\n• Allocate resources according to plan\n• Establish success metrics and monitoring\n• Execute phased implementation approach\n\n**Expected Impact**\nThe proposed initiative is projected to deliver significant benefits while managing associated risks through a structured approach.`
    };
    
    return summaries[type] || summaries.brief;
  }