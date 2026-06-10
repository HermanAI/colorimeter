"""
Exam Scheduling System using Graph Theory and Graph Coloring
Author: Copilot
Purpose: Schedule university/school exams without conflicts using chromatic graph coloring
Algorithm: Welsh-Powell (Greedy Graph Coloring)
"""

from collections import defaultdict, deque
from typing import Dict, List, Set, Tuple
import heapq


class ExamScheduler:
    """
    A class to schedule exams using graph coloring theory.
    
    Exams are nodes in a graph.
    Edges connect exams that have students in common (conflicts).
    Colors represent time slots.
    """
    
    def __init__(self):
        """Initialize the exam scheduler."""
        self.exams = {}  # exam_id -> exam_name
        self.students = {}  # student_id -> list of exam_ids
        self.graph = defaultdict(set)  # adjacency list for conflict graph
        self.exam_colors = {}  # exam_id -> color (time slot)
        self.time_slots = {}  # color -> time slot info
        
    def add_exam(self, exam_id: str, exam_name: str) -> None:
        """Add an exam to the scheduler."""
        self.exams[exam_id] = exam_name
        if exam_id not in self.graph:
            self.graph[exam_id] = set()
    
    def add_student(self, student_id: str, exam_ids: List[str]) -> None:
        """
        Add a student enrolled in multiple exams.
        
        Args:
            student_id: Unique student identifier
            exam_ids: List of exam IDs the student is taking
        """
        self.students[student_id] = exam_ids
        
        # Create conflict edges between exams taken by same student
        for i in range(len(exam_ids)):
            for j in range(i + 1, len(exam_ids)):
                exam1, exam2 = exam_ids[i], exam_ids[j]
                self.graph[exam1].add(exam2)
                self.graph[exam2].add(exam1)
    
    def build_conflict_graph(self) -> None:
        """Build the conflict graph based on student enrollments."""
        for exam_id in self.exams:
            if exam_id not in self.graph:
                self.graph[exam_id] = set()
    
    def get_degree(self, exam_id: str) -> int:
        """Get the degree (number of conflicts) of an exam."""
        return len(self.graph[exam_id])
    
    def welsh_powell_coloring(self) -> Dict[str, int]:
        """
        Welsh-Powell Algorithm for Graph Coloring.
        
        Greedy algorithm that:
        1. Sorts exams by degree (descending)
        2. Assigns each exam the smallest available color
        3. Minimizes the total number of time slots needed
        
        Returns:
            Dictionary mapping exam_id to color (time slot)
        """
        # Sort exams by degree (descending) - higher degree first
        sorted_exams = sorted(self.exams.keys(), 
                            key=lambda x: self.get_degree(x), 
                            reverse=True)
        
        exam_colors = {}
        available_colors = defaultdict(set)  # exam_id -> set of available colors
        
        for exam_id in sorted_exams:
            # Find colors used by conflicting exams
            used_colors = {exam_colors[neighbor] 
                          for neighbor in self.graph[exam_id] 
                          if neighbor in exam_colors}
            
            # Find the smallest available color
            color = 0
            while color in used_colors:
                color += 1
            
            exam_colors[exam_id] = color
        
        self.exam_colors = exam_colors
        return exam_colors
    
    def get_chromatic_number(self) -> int:
        """
        Get the chromatic number (minimum number of colors/time slots needed).
        
        Returns:
            Number of different time slots required
        """
        if not self.exam_colors:
            return 0
        return max(self.exam_colors.values()) + 1
    
    def set_time_slots(self, time_slot_mapping: Dict[int, str]) -> None:
        """
        Set actual time slot information for each color.
        
        Args:
            time_slot_mapping: Dictionary mapping color -> time slot description
                              Example: {0: "Monday 09:00-11:00", 1: "Monday 14:00-16:00"}
        """
        self.time_slots = time_slot_mapping
    
    def get_schedule(self) -> Dict[str, Tuple[str, str]]:
        """
        Get the final exam schedule.
        
        Returns:
            Dictionary mapping exam_id -> (exam_name, time_slot)
        """
        if not self.exam_colors:
            raise ValueError("Schedule not generated. Run welsh_powell_coloring() first.")
        
        schedule = {}
        for exam_id, color in self.exam_colors.items():
            exam_name = self.exams[exam_id]
            time_slot = self.time_slots.get(color, f"Time Slot {color}")
            schedule[exam_id] = (exam_name, time_slot)
        
        return schedule
    
    def get_schedule_by_time_slot(self) -> Dict[str, List[Tuple[str, str]]]:
        """
        Get the schedule organized by time slot.
        
        Returns:
            Dictionary mapping time_slot -> list of (exam_id, exam_name)
        """
        schedule_by_slot = defaultdict(list)
        
        for exam_id, color in self.exam_colors.items():
            exam_name = self.exams[exam_id]
            time_slot = self.time_slots.get(color, f"Time Slot {color}")
            schedule_by_slot[time_slot].append((exam_id, exam_name))
        
        return dict(schedule_by_slot)
    
    def is_valid_schedule(self) -> bool:
        """
        Validate that the schedule has no conflicts.
        
        Returns:
            True if no student takes two exams at same time, False otherwise
        """
        for student_id, exam_ids in self.students.items():
            colors = [self.exam_colors[exam_id] for exam_id in exam_ids]
            if len(colors) != len(set(colors)):
                return False
        return True
    
    def print_schedule(self) -> None:
        """Print a formatted schedule."""
        if not self.exam_colors:
            print("No schedule generated yet.")
            return
        
        print("\n" + "="*70)
        print("EXAM SCHEDULE USING GRAPH COLORING THEORY")
        print("="*70)
        print(f"\nChromatic Number (Time Slots Needed): {self.get_chromatic_number()}")
        print(f"Total Exams: {len(self.exams)}")
        print(f"Total Students: {len(self.students)}")
        print(f"Valid Schedule (No Conflicts): {self.is_valid_schedule()}")
        
        print("\n" + "-"*70)
        print("BY TIME SLOT:")
        print("-"*70)
        
        schedule_by_slot = self.get_schedule_by_time_slot()
        for time_slot in sorted(schedule_by_slot.keys()):
            print(f"\n{time_slot}")
            for exam_id, exam_name in schedule_by_slot[time_slot]:
                print(f"  • {exam_name} (ID: {exam_id})")
        
        print("\n" + "-"*70)
        print("BY EXAM:")
        print("-"*70)
        
        schedule = self.get_schedule()
        for exam_id in sorted(schedule.keys()):
            exam_name, time_slot = schedule[exam_id]
            print(f"{exam_name:30} → {time_slot}")
        
        print("\n" + "="*70)
    
    def print_graph_info(self) -> None:
        """Print information about the conflict graph."""
        print("\n" + "="*70)
        print("CONFLICT GRAPH ANALYSIS")
        print("="*70)
        
        print("\nExam Degrees (Number of Conflicts):")
        for exam_id in sorted(self.exams.keys(), 
                             key=lambda x: self.get_degree(x), 
                             reverse=True):
            degree = self.get_degree(exam_id)
            conflicting_exams = self.graph[exam_id]
            print(f"  {self.exams[exam_id]:30} - Degree: {degree}")
            if conflicting_exams:
                print(f"    Conflicts with: {', '.join(self.exams[e] for e in conflicting_exams)}")
        
        print("\n" + "="*70)


def main():
    """Main function with example usage."""
    
    # Create scheduler instance
    scheduler = ExamScheduler()
    
    # Add exams
    exams = {
        "MATH101": "Calculus I",
        "MATH102": "Linear Algebra",
        "PHYS101": "Physics I",
        "PHYS102": "Physics II",
        "CHEM101": "Chemistry I",
        "CS101": "Introduction to Programming",
        "CS102": "Data Structures",
        "ENG101": "English Literature"
    }
    
    for exam_id, exam_name in exams.items():
        scheduler.add_exam(exam_id, exam_name)
    
    # Add students with their exam enrollments
    students_exams = {
        "S001": ["MATH101", "PHYS101", "CS101"],
        "S002": ["MATH101", "MATH102", "CHEM101"],
        "S003": ["PHYS101", "PHYS102", "CS101"],
        "S004": ["MATH102", "CS102", "ENG101"],
        "S005": ["MATH101", "CS101", "ENG101"],
        "S006": ["PHYS101", "CHEM101", "CS102"],
        "S007": ["MATH102", "PHYS102", "ENG101"],
        "S008": ["CS101", "CS102", "CHEM101"],
        "S009": ["MATH101", "MATH102", "PHYS101", "PHYS102"],
        "S010": ["CHEM101", "CS101", "CS102", "ENG101"],
    }
    
    for student_id, exam_ids in students_exams.items():
        scheduler.add_student(student_id, exam_ids)
    
    # Build conflict graph
    scheduler.build_conflict_graph()
    
    # Print graph analysis
    scheduler.print_graph_info()
    
    # Apply Welsh-Powell coloring algorithm
    print("\nApplying Welsh-Powell Graph Coloring Algorithm...")
    scheduler.welsh_powell_coloring()
    
    # Define time slots
    time_slots = {
        0: "Monday 09:00-11:00",
        1: "Monday 14:00-16:00",
        2: "Tuesday 09:00-11:00",
        3: "Tuesday 14:00-16:00",
        4: "Wednesday 09:00-11:00",
        5: "Wednesday 14:00-16:00",
    }
    
    scheduler.set_time_slots(time_slots)
    
    # Print final schedule
    scheduler.print_schedule()


if __name__ == "__main__":
    main()
